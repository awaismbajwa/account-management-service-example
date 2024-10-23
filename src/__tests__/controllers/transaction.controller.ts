// in your test file
import {expect} from '@loopback/testlab';
import {TransactionController} from '../../controllers';
import {ExchangeRateDataSource} from '../../datasources';
import {testdb} from '../../datasources/testdb.datasource';
import {AccountRepository, CustomerRepository, TransactionRepository} from '../../repositories';
import {ExchangeRateProvider} from '../../services';
import {givenEmptyDatabase} from '../helpers/database.helpers';

describe('TransactionController', () => {
  before(givenEmptyDatabase);

  describe('count', () => {

    it('returns the total count of transactions', async () => {
      let accountRepository: AccountRepository;
      let customerRepository: CustomerRepository;
      let transactionRepository = new TransactionRepository(testdb, async () => accountRepository);
      customerRepository = new CustomerRepository(testdb, async () => accountRepository);
      accountRepository = new AccountRepository(testdb, async () => customerRepository);

      let exchangeRate = await new ExchangeRateProvider(new ExchangeRateDataSource()).value();

      const controller = new TransactionController(transactionRepository, accountRepository, exchangeRate);

      const count = await controller.count();

      expect(count).to.containEql({count: 0});
    });

  });

});


