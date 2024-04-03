import { Inject, Injectable } from '@nestjs/common';
import { ExchangeClient } from './client/exchange.client';
import { ExchangeRate } from './dto/exchange-rate.dto';

@Injectable()
export class ExchangeRatesProvider {
  private readonly cache: Map<string, ExchangeRate[]> = new Map<
    string,
    ExchangeRate[]
  >(); //@todo should be redis  or other service for that

  constructor(
    @Inject(ExchangeClient) private readonly client: ExchangeClient,
  ) {}

  public async getExchangeRate(
    from: number,
    to: number,
  ): Promise<ExchangeRate> {
    const rates = await this.getExchangeRates();
    const rate = rates.filter(
      (rate: ExchangeRate) =>
        (rate.currencyCodeFirst === from && rate.currencyCodeSecond === to) ||
        (rate.currencyCodeFirst === to && rate.currencyCodeSecond === from),
    )[0];

    if (rate === undefined) {
      //@todo change an error to visible in response
      throw new Error('Exchange rate not found');
    }

    return rate;
  }

  public async getExchangeRates(): Promise<ExchangeRate[]> {
    let rates = this.cache.get('rates');
    if (rates == undefined) {
      rates = await this.client.getExchangeRates();
      this.cache.set('rates', rates);
      //@todo add expiration time for cache
    }

    return rates;
  }
}
