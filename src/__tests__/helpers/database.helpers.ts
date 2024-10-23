import {testdb} from '../../datasources/testdb.datasource';
import {AccountRepository, CustomerRepository, TransactionRepository} from '../../repositories';

export async function givenEmptyDatabase() {
  let customerRepository: CustomerRepository;
  let accountRepository: AccountRepository;
  let transactionRepository: TransactionRepository;

  accountRepository = new AccountRepository(testdb, async () => customerRepository);
  customerRepository = new CustomerRepository(testdb, async () => accountRepository);
  transactionRepository = new TransactionRepository(testdb, async () => accountRepository)

  await accountRepository.deleteAll();
  await customerRepository.deleteAll();
  await transactionRepository.deleteAll();
}
