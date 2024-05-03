import { Transformer } from '@libs/core';
import { JobTrackerModel } from '@libs/jobs/models';

export class JobsLTransformer extends Transformer {
  async transform(job: JobTrackerModel): Promise<Record<string, any>> {
    return {
      id: job.uuid,
      jobName: job.jobName,
      jobStatus: job.jobStatus,
      jobData: job.jobData,
      startTime: job.startTime,
      endTime: job.endTime,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
