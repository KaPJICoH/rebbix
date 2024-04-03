import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MonobankExchangeClient } from './client/monobank-exchange.client';
import { ExchangeRatesProvider } from './exchange-rates.provider';
import { ExchangeClient } from './client/exchange.client';
import { ExchangerService } from './exchanger.service';
import { ExchangeController } from './exchange.controller';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: ExchangeClient,
      useClass: MonobankExchangeClient,
    },
    ExchangeRatesProvider,
    ExchangerService,
  ],
  exports: [ExchangeRatesProvider],
  controllers: [ExchangeController],
})
export class ExchangeModule {}
