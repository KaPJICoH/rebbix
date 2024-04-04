import { Module } from '@nestjs/common';
import { ExchangeModule } from './exchange/exchange.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from './config/config.module';
import { AppConfig } from './config/app.config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule,
    ExchangeModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (appConfig: AppConfig) => ({
        store: redisStore,
        host: appConfig.redis.host,
        port: appConfig.redis.port,
      }),
      imports: [ConfigModule],
      inject: [AppConfig],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
