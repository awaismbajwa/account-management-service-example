import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,

  param
} from '@loopback/rest';
import {Account} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerAccountController {
  constructor(
    @repository(CustomerRepository) protected customerRepository: CustomerRepository,
  ) {}

  @get('/customers/{id}/accounts', {
    responses: {
      '200': {
        description: 'Array of Customer has many Account',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Account)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Account>,
  ): Promise<Account[]> {
    return this.customerRepository.accounts(id).find(filter);
  }


}
