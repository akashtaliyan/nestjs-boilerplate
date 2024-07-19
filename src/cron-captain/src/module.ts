import { Module } from '@nestjs/common';
import { CronService } from './services';
import { ScheduleModule } from '@nestjs/schedule';

import { CoreModule } from '@libs/core';
import { ConsoleModule } from '@libs/nestjs-console';
import { VaultModule } from '@libs/vault';
import { ObjectionModule } from '@libs/nestjs-objection';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueModule } from '@libs/nestjs-queue';

@Module({
  imports: [
    CoreModule,
    ConsoleModule,
    ScheduleModule.forRoot(),
    VaultModule,
    ObjectionModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('db'),
      inject: [ConfigService],
    }),
    QueueModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('queue'),
      inject: [ConfigService],
    }),
  ],

  providers: [CronService],
})
export class CronCaptainModule {}
