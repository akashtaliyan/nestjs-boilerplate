import { BaseModel } from '@libs/nestjs-objection';

export class JobLogModel extends BaseModel {
  static tableName = 'job_logs';

  jobId: number;
  log: string;
  logTime: Date;

  // Relation back to job tracker
  static get relationMappings() {
    const { JobTrackerModel } = require('./JobTrackerModel'); // Use dynamic require to avoid circular dependency issues

    return {
      jobTracker: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: JobTrackerModel,
        join: {
          from: 'job_logs.job_id',
          to: 'job_tracker.id',
        },
      },
    };
  }
}
