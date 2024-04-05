import { Injectable } from '@nestjs/common';
import { ExchangeRatesProvider } from './exchange-rates.provider';
import { CurrencyCode } from './currency-code.enum';
import { ExchangeRate } from './dto/exchange-rate.dto';

@Injectable()
export class ExchangerService {
  constructor(private readonly exchangeRatesProvider: ExchangeRatesProvider) {}

  public async exchange(
    from: CurrencyCode,
    to: CurrencyCode,
    amount: number,
  ): Promise<number> {
    if (from === to) {
      return amount;
    }

    const rate: ExchangeRate = await this.exchangeRatesProvider.getExchangeRate(
      from,
      to,
    );
    let value: number = 0;
    if (rate.currencyCodeFirst === from) {
      value = amount * rate.rateBuy;
    } else if (rate.currencyCodeFirst === to) {
      value = amount / rate.rateSell;
    }

    return Number(value.toFixed(2));
  }
}
