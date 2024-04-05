import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ExchangeClient } from './client/exchange.client';
import { ExchangeRate } from './dto/exchange-rate.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { AppConfig } from '../config/app.config';
import { CurrencyCode } from './currency-code.enum';

@Injectable()
export class ExchangeRatesProvider {
  constructor(
    @Inject(ExchangeClient) private readonly client: ExchangeClient,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly config: AppConfig,
  ) {}

  public async getExchangeRate(
    from: CurrencyCode,
    to: CurrencyCode,
  ): Promise<ExchangeRate> {
    const rates: ExchangeRate[] = await this.getExchangeRates();
    const rate: ExchangeRate | undefined = rates.filter(
      (rate: ExchangeRate) =>
        (rate.currencyCodeFirst === from && rate.currencyCodeSecond === to) ||
        (rate.currencyCodeFirst === to && rate.currencyCodeSecond === from),
    )[0];

    if (rate === undefined) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        result: false,
        error: 'Exchange rate for provided currencies not found',
      });
    }

    return rate;
  }

  public async getExchangeRates(): Promise<ExchangeRate[]> {
    let rates: ExchangeRate[] = await this.cacheManager.get('rates');
    if (rates == undefined) {
      rates = await this.client.getExchangeRates();
      await this.cacheManager.set(
        'rates',
        rates,
        this.config.exchange.rates.cache_ttl,
      );
    }

    return rates;
  }
}
