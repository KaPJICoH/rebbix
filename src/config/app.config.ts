import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class AppConfig {
  redis = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  };
  exchange = {
    rates: {
      cache_ttl: Number(process.env.EXCHANGE_RATES_CACHE_TTL),
    }
  }
}
