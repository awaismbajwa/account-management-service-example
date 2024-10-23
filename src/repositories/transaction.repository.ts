import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Transaction, TransactionRelations, Account} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {AccountRepository} from './account.repository';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  TransactionRelations
> {

  public readonly account: BelongsToAccessor<Account, typeof Transaction.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('AccountRepository') protected accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(Transaction, dataSource);
    this.account = this.createBelongsToAccessorFor('account', accountRepositoryGetter,);
  }
}
