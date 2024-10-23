import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Transaction,
  Account,
} from '../models';
import {TransactionRepository} from '../repositories';

export class TransactionAccountController {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository: TransactionRepository,
  ) { }

  @get('/transactions/{id}/account', {
    responses: {
      '200': {
        description: 'Account belonging to Transaction',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Account)},
          },
        },
      },
    },
  })
  async getAccount(
    @param.path.number('id') id: typeof Transaction.prototype.id,
  ): Promise<Account> {
    return this.transactionRepository.account(id);
  }
}
