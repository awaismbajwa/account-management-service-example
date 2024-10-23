import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Account} from './account.model';

@model({
  name: 'Transaction',
  settings: {
    foreignKeys: {
      fk_accountId: {
        name: 'fk_accountId',
        entity: 'Account',
        entityKey: 'id',
        foreignKey: 'accountId'
      }
    }
  }
})
export class Transaction extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['debit', 'credit']
    }
  })
  type: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 0
    }
  })
  amount: number;

  @property({
    dataType: 'datetime',
    required: true
  })
  createdOn: Date

  @belongsTo(() => Account)
  accountId: number;

  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}


export function validateTransaction(
  transaction: Transaction,
  account: Account,
) {
  let amount = transaction.amount;
  if (amount <= 0) {
    throw new Error('Amount is invalid.')
  }
  if (transaction.type === 'credit') {
    if (account!.balance! < amount) {
      throw new Error('Insufficient balance.')
    }
  }
}


export interface TransactionRelations {
  // describe navigational properties here
}

export type TransactionWithRelations = Transaction & TransactionRelations;
