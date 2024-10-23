// in your test file
import {expect} from '@loopback/testlab';
import {AccountController} from '../../controllers';
import {testdb} from '../../datasources/testdb.datasource';
import {AccountRepository, CustomerRepository} from '../../repositories';
import {givenEmptyDatabase} from '../helpers/database.helpers';

describe('AccountController', () => {
  before(givenEmptyDatabase);

  describe('count', () => {

    it('returns the total count of accounts', async () => {
      let customerRepository: CustomerRepository;
      let accountRepository = new AccountRepository(testdb, async () => customerRepository);
      const controller = new AccountController(accountRepository);

      const count = await controller.count();

      expect(count).to.containEql({count: 0});
    });

  });

});


