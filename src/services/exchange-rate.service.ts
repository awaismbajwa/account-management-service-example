import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {ExchangeRateDataSource} from '../datasources';

export interface ExchangeRate {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  exchange(currency: string): Promise<any>
}

export class ExchangeRateProvider implements Provider<ExchangeRate> {
  constructor(
    // ExchangeRate must match the name property in the datasource json file
    @inject('datasources.ExchangeRate')
    protected dataSource: ExchangeRateDataSource = new ExchangeRateDataSource(),
  ) {}

  value(): Promise<ExchangeRate> {
    return getService(this.dataSource);
  }
}
