import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'ExchangeRate',
  connector: 'rest',
  baseURL: 'https://v6.exchangerate-api.com/v6/f525a6a7972104e71951f7b3/latest/',
  crud: false,
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: 'https://v6.exchangerate-api.com/v6/f525a6a7972104e71951f7b3/latest/{currency}',
      },
      functions: {
        exchange: ['currency']
      }
    }
  ]
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ExchangeRateDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'ExchangeRate';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.ExchangeRate', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
