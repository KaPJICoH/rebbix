import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { ExchangeClient } from './exchange.client';
import { ExchangeRate } from '../dto/exchange-rate.dto';

@Injectable()
export class MonobankExchangeClient implements ExchangeClient {
  constructor(private readonly httpService: HttpService) {}

  public async getExchangeRate(
    fromCurrency: number,
    toCurrency: number,
  ): Promise<ExchangeRate> {
    //@todo enum of currency by ISO 4217
    const exchangeRates = await this.getExchangeRates();
    const rate = exchangeRates.filter(
      (rate: ExchangeRate) =>
        (rate.currencyCodeFirst === fromCurrency &&
          rate.currencyCodeSecond === toCurrency) ||
        (rate.currencyCodeFirst === toCurrency &&
          rate.currencyCodeSecond === fromCurrency),
    )[0];
    if (rate === undefined) {
      //@todo change an error to visible in response
      throw new Error('Exchange rate not found');
    }

    return rate;
  }

  public async getExchangeRates(): Promise<ExchangeRate[]> {
    const response = await firstValueFrom(
      this.httpService.get('https://api.monobank.ua/bank/currency').pipe(
        map((response) => response.data),
        catchError((error) => {
          return 'error';
        }),
      ),
    );

    return response.map(
      (rate: {
        currencyCodeA: number;
        currencyCodeB: number;
        rateBuy?: number;
        rateSell?: number;
        rateCross?: number;
      }): ExchangeRate => {
        return {
          currencyCodeFirst: rate.currencyCodeA, //@todo convert to currency by ISO 4217
          currencyCodeSecond: rate.currencyCodeB, //@todo convert to currency by ISO 4217
          rateBuy: rate.rateBuy == undefined ? rate.rateCross : rate.rateBuy,
          rateSell: rate.rateSell == undefined ? rate.rateCross : rate.rateSell,
        };
      },
    );
  }
}
