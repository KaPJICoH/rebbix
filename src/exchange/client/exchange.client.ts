import { ExchangeRate } from '../dto/exchange-rate.dto';

export interface ExchangeClient {
  getExchangeRate(
    fromCurrency: number,
    toCurrency: number,
  ): Promise<ExchangeRate>;
  getExchangeRates(): Promise<ExchangeRate[]>;
}

export const ExchangeClient = Symbol('ExchangeClient');
