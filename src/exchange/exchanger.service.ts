import { Injectable } from '@nestjs/common';
import { ExchangeRatesProvider } from './exchange-rates.provider';

@Injectable()
export class ExchangerService {
  constructor(private readonly exchangeRatesProvider: ExchangeRatesProvider) {}

  public async exchange(
    from: number,
    to: number,
    amount: number,
  ): Promise<number> {
    const rate = await this.exchangeRatesProvider.getExchangeRate(from, to);
    let value: number = 0;
    if (rate.currencyCodeFirst === from) {
      value = amount * rate.rateBuy;
    } else if (rate.currencyCodeFirst === to) {
      value = amount / rate.rateSell;
    }

    return Number(value.toFixed(2));
  }
}
