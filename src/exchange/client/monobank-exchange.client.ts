import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { ExchangeClient } from './exchange.client';
import { ExchangeRate } from '../dto/exchange-rate.dto';
import { CurrencyCode } from '../currency-code.enum';

@Injectable()
export class MonobankExchangeClient implements ExchangeClient {
  constructor(private readonly httpService: HttpService) {}

  public async getExchangeRate(
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode,
  ): Promise<ExchangeRate> {
    //@todo enum of currency by ISO 4217
    const exchangeRates: ExchangeRate[] = await this.getExchangeRates();
    const rate: ExchangeRate | undefined = exchangeRates.filter(
      (rate: ExchangeRate) =>
        (rate.currencyCodeFirst === fromCurrency &&
          rate.currencyCodeSecond === toCurrency) ||
        (rate.currencyCodeFirst === toCurrency &&
          rate.currencyCodeSecond === fromCurrency),
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
    const response = await firstValueFrom(
      this.httpService.get('https://api.monobank.ua/bank/currency').pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              result: false,
              error: 'Internal server error',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
            { cause: error },
          );
        }),
      ),
    );

    return response.map(
      (rate: {
        currencyCodeA: CurrencyCode;
        currencyCodeB: CurrencyCode;
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
