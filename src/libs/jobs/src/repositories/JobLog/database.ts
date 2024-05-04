import { JobLogModel, JobTrackerModel } from '@libs/jobs/models';
import { DatabaseRepository, InjectModel } from '@libs/nestjs-objection';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JobLogRepository extends DatabaseRepository<JobLogModel> {
  @InjectModel(JobLogModel)
  model: JobLogModel;
}
