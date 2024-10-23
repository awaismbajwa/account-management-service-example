// in your test file
import {expect} from '@loopback/testlab';
import {CustomerController} from '../../controllers';
import {testdb} from '../../datasources/testdb.datasource';
import {AccountRepository, CustomerRepository} from '../../repositories';
import {givenEmptyDatabase} from '../helpers/database.helpers';

describe('CustomerController', () => {
  before(givenEmptyDatabase);

  describe('count', () => {

    it('returns the total count of customers', async () => {
      let accountRepository: AccountRepository;
      let customerRepository = new CustomerRepository(testdb, async () => accountRepository);
      accountRepository = new AccountRepository(testdb, async () => customerRepository);

      const controller = new CustomerController(customerRepository);

      const count = await controller.count();

      expect(count).to.containEql({count: 0});
    });

  });

});


