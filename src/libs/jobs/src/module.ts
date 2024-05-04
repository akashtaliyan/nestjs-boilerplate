import { Module } from '@nestjs/common';
import { JobsService } from './services';
import { JobTrackerConstants } from './constants';
import { JobTrackerRepository } from './repositories/JobTracker';
import { JobLogRepository } from './repositories';
import { QueueModule } from '@libs/nestjs-queue';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ObjectionModule } from '@libs/nestjs-objection';

@Module({
  imports: [
    ObjectionModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('db'),
      inject: [ConfigService],
    }),
  ],
  providers: [
    JobsService,
    {
      provide: JobTrackerConstants.JobLogsRepo,
      useClass: JobLogRepository,
    },
    {
      provide: JobTrackerConstants.JobTrackerRepo,
      useClass: JobTrackerRepository,
    },
  ],
  exports: [JobsService],
})
export class JobsModule {}
