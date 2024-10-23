import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Account,
  Customer,
} from '../models';
import {AccountRepository} from '../repositories';

export class AccountCustomerController {
  constructor(
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
  ) { }

  @get('/accounts/{id}/customer', {
    responses: {
      '200': {
        description: 'Customer belonging to Account',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Customer)},
          },
        },
      },
    },
  })
  async getCustomer(
    @param.path.number('id') id: typeof Account.prototype.id,
  ): Promise<Customer> {
    return this.accountRepository.customer(id);
  }
}
