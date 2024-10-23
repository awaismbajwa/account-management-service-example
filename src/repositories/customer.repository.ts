import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Customer, CustomerRelations, Account} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {AccountRepository} from './account.repository';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {

  public readonly accounts: HasManyRepositoryFactory<Account, typeof Customer.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('AccountRepository') protected accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(Customer, dataSource);
    this.accounts = this.createHasManyRepositoryFactoryFor('accounts', accountRepositoryGetter,);
    this.registerInclusionResolver('accounts', this.accounts.inclusionResolver);
  }
}
