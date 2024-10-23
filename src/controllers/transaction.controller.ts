import {inject} from '@loopback/core';
import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {Transaction, validateTransaction} from '../models';
import {AccountRepository, TransactionRepository} from '../repositories';
import {ExchangeRate} from '../services';

export class TransactionController {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository: TransactionRepository,
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
    @inject('services.ExchangeRate')
    public exchangeRate: ExchangeRate
  ) {}

  @post('/transactions', {
    responses: {
      '200': {
        description: 'Transaction model instance',
        content: {'application/json': {schema: getModelSchemaRef(Transaction)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {
            title: 'NewTransaction',
            exclude: ['id'],
          }),
        },
      },
    })
    transaction: Omit<Transaction, 'id'>,
  ): Promise<Transaction> {
    const account = await this.accountRepository.findById(transaction.accountId);
    validateTransaction(transaction, account)
    return this.transactionRepository.create(transaction).then(res => {
      if (transaction.type == 'credit') {
        account.balance = account!.balance! - transaction.amount;
      }
      else {
        account.balance = account!.balance! + transaction.amount;
      }
      this.accountRepository.updateById(res.accountId, account);
      return res;
    })
  }


  @post('/accounttransaction', {
    responses: {
      '200': {
        description: 'Create a transaction between two accounts',
        content: {'application/json': {schema: getModelSchemaRef(Transaction)}},
      }
    }
  })
  async createAccountTransaction(
    @param.query.number('sender_id') senderId: number,
    @param.query.number('receiver_id') receiverId: number,
    @param.query.number('sender_amount') senderAmount: number
  ): Promise<Transaction[]> {
    const sender = await this.accountRepository.findById(senderId);
    const receiver = await this.accountRepository.findById(receiverId);
    let creditTransaction = new Transaction({
      type: 'credit',
      accountId: sender.id,
      amount: senderAmount,
      createdOn: new Date()
    })
    validateTransaction(creditTransaction, sender)

    let exchangeResult: any = await this.exchangeRate.exchange(sender.currency);
    let receiverAmount = senderAmount * exchangeResult.conversion_rates[receiver.currency.toUpperCase()]

    let debitTransaction = new Transaction({
      type: 'debit',
      accountId: receiver.id,
      amount: receiverAmount,
      createdOn: new Date()
    })
    validateTransaction(debitTransaction, receiver)

    let createCB = (newT: Transaction) => {
      if (newT.type == 'credit') {
        sender.balance = sender!.balance! - newT.amount;
        this.accountRepository.updateById(newT.accountId, sender);
      }
      else {
        receiver.balance = receiver!.balance! + newT.amount;
        this.accountRepository.updateById(newT.accountId, receiver);
      }
      return newT;
    }

    let result = []
    result.push(await this.transactionRepository.create(creditTransaction).then(createCB));
    result.push(await this.transactionRepository.create(debitTransaction).then(createCB));
    return result;
  }



  @get('/transactions/count', {
    responses: {
      '200': {
        description: 'Transaction model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Transaction) where?: Where<Transaction>,
  ): Promise<Count> {
    return this.transactionRepository.count(where);
  }

  @get('/transactions', {
    responses: {
      '200': {
        description: 'Array of Transaction model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Transaction, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Transaction) filter?: Filter<Transaction>,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find(filter);
  }


  @get('/transactionslog/{startDate}/{endDate}', {
    responses: {
      '200': {
        description: 'Transaction log between start and end date',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Transaction, {includeRelations: true}),
          },
        }
      }
    }
  })
  async findByTime(
    @param.path.dateTime('startDate') startDate: Date,
    @param.path.dateTime('endDate') endDate: Date,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        createdOn: {
          gt: startDate,
          lt: endDate
        }
      }
    })
  }


  @get('/transactions/{id}', {
    responses: {
      '200': {
        description: 'Transaction model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Transaction, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Transaction, {exclude: 'where'}) filter?: FilterExcludingWhere<Transaction>
  ): Promise<Transaction> {
    return this.transactionRepository.findById(id, filter);
  }


  @del('/transactions/{id}', {
    responses: {
      '204': {
        description: 'Transaction DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.transactionRepository.deleteById(id);
  }
}
