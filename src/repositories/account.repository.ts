import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Account, AccountRelations, Customer} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CustomerRepository} from './customer.repository';

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.id,
  AccountRelations
> {

  public readonly customer: BelongsToAccessor<Customer, typeof Account.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CustomerRepository') protected customerRepositoryGetter: Getter<CustomerRepository>,
  ) {
    super(Account, dataSource);
    this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter,);
  }
}
