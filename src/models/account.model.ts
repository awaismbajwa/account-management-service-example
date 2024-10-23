import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Customer} from './customer.model';

@model({
  name: 'Account',
  settings: {
    foreignKeys: {
      fk_customerId: {
        name: 'fk_customerId',
        entity: 'Customer',
        entityKey: 'id',
        foreignKey: 'customerId'
      }
    }
  }
})
export class Account extends Entity {
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
      minLength: 5
    }
  })
  title: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['eur', 'usd']
    }
  })
  currency: string;

  @property({
    type: 'number',
    default: 0,
    jsonSchema: {
      minimum: 0
    }
  })
  balance?: number;

  @belongsTo(() => Customer)
  customerId: number;

  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  // describe navigational properties here
}

export type AccountWithRelations = Account & AccountRelations;
