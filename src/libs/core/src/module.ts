import config from '@config/index';
import { CacheManagerOptions, CacheModule } from '@nestjs/cache-manager';
import { Global, Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ClsModule } from 'nestjs-cls';
import { CacheService } from './cache';
import { AppConfig } from './utils/appConfig';
import { BaseValidator } from './validator';
import { RequestContext } from './reqContext';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserLibModule } from '@src/libs/user/src';

@Global()
@Module({
  imports: [
    // DiscoveryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: config,
    }),
    // Importing CacheModule and passing the RedisOptions from the config file

    // CacheModule.registerAsync<CacheManagerOptions>({
    //   imports: [ConfigModule],
    //   isGlobal: true,
    //   useFactory: (config: ConfigService) => {
    //     const redisConfig = config.get('cacheManager') || {};
    //     return {
    //       ...redisConfig,
    //       store: redisStore,
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    // PrometheusModule.register({
    //   path: 'metrics',
    // }),
    ClsModule.forRoot({
      global: true,
    }),
  ],
  providers: [
    BaseValidator,
    AppConfig,
    //  CacheService,
    RequestContext,
  ],
  exports: [
    BaseValidator,
    //  CacheModule,
    // CacheService,
    RequestContext,
  ],
})
export class CoreModule {}
