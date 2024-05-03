import { UuidDto } from '@libs/common';

import { JobsService } from '@libs/jobs';
import { GetJobsDto } from '@libs/jobs/validators';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JobsManagerApisService {
  constructor(private jobsLibService: JobsService) {}

  async getAllJobs(inputs: GetJobsDto) {
    const jobs = await this.jobsLibService.getJobs(inputs);
    return jobs;
  }

  async getSingleJob(inputs: UuidDto) {
    const plan = this.jobsLibService.getJobWithLogs(inputs.id);
    return plan;
  }

  async retriggerJob(inputs: UuidDto) {
    const job = await this.jobsLibService.retriggerJob(inputs.id);
    return job;
  }
}
