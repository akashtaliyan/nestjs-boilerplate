import { BaseModel } from '@libs/nestjs-objection';
import { TRACKER_JOB_STATUS } from '../constants';
import { JobLogModel } from './JobLogModel';

export class JobTrackerModel extends BaseModel {
  static tableName = 'job_tracker';

  id: number;
  uuid: string;
  jobName: string;
  jobStatus: TRACKER_JOB_STATUS;
  jobData: Record<string, any>;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
  logs?: JobLogModel[];

  // Relation to job logs
  static get relationMappings() {
    const { JobLogModel } = require('./JobLogModel'); // Use dynamic require to avoid circular dependency issues

    return {
      logs: {
        relation: BaseModel.HasManyRelation,
        modelClass: JobLogModel,
        join: {
          from: 'job_tracker.id',
          to: 'job_logs.job_id',
        },
      },
    };
  }
}
