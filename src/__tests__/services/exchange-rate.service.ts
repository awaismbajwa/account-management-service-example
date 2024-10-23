import {expect} from '@loopback/testlab';
import {ExchangeRateDataSource} from '../../datasources';
import {ExchangeRate, ExchangeRateProvider} from '../../services';

describe('ExchangeRateService', () => {
  let service: Promise<ExchangeRate>;
  before(givenExchangeService);

  it('returns the exchange rates for the given currency', async () => {
    service.then((sc) => {
      sc.exchange('usd').then((res) => {
        expect(res).to.not.be.undefined
        expect(res.result).to.be.equal('success')
        expect(res.base_code).to.be.equal('USD')
        expect(res.conversion_rates).to.not.be.undefined
      });
    })

  });

  function givenExchangeService() {
    const dataSource = new ExchangeRateDataSource();
    service = new ExchangeRateProvider(dataSource).value();
  }
});
