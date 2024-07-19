import { JobsModule } from '@libs/jobs';
import { ObjectionModule } from '@libs/nestjs-objection';
import { QueueModule } from '@libs/nestjs-queue';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JobsManagerApisController, JobsManagerApisService } from './admin';

@Module({
  imports: [
    // UsersLibModule,
    // ObjectionModule.registerAsync({
    //   isGlobal: true,
    //   imports: [ConfigModule],
    //   useFactory: (config: ConfigService) => config.get('db'),
    //   inject: [ConfigService],
    // }),
    QueueModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('queue'),
      inject: [ConfigService],
    }),
  ],
  controllers: [JobsManagerApisController],
  providers: [JobsManagerApisService],
})
export class JobManagerApisModule {}
