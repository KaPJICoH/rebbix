import { ExchangeRate } from '../dto/exchange-rate.dto';
import { CurrencyCode } from '../currency-code.enum';

export interface ExchangeClient {
  getExchangeRate(
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode,
  ): Promise<ExchangeRate>;

  getExchangeRates(): Promise<ExchangeRate[]>;
}

export const ExchangeClient = Symbol('ExchangeClient');
