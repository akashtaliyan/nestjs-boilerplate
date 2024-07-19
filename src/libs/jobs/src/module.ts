import { ObjectionModule } from '@libs/nestjs-objection';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobTrackerConstants } from './constants';
import { JobLogRepository } from './repositories';
import { JobTrackerRepository } from './repositories/JobTracker';
import { JobsService } from './services';

@Module({
  imports: [
    // ObjectionModule.registerAsync({
    //   isGlobal: true,
    //   imports: [ConfigModule],
    //   useFactory: (config: ConfigService) => config.get('db'),
    //   inject: [ConfigService],
    // }),
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
