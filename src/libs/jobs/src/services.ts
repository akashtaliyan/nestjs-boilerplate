import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JobTrackerRepository } from './repositories/JobTracker';
import { JobLogRepository } from './repositories';
import { JobLogModel, JobTrackerModel } from './models';
import {
  JobTrackerConstants,
  TRACKER_JOB_COMPLETE_STATUSES,
  TRACKER_JOB_STATUS,
} from './constants';
import { Dispatch } from '@libs/nestjs-queue';
import { ObjectionService } from '@libs/nestjs-objection';
import { Knex } from 'knex';
import { Message } from '@libs/nestjs-queue-strategy';
import { GetJobsDto } from './validators';
import { COMMON_JOBS } from '@libs/common';

@Injectable()
export class JobsService {
  private dbConn: Knex<any, any[]>;
  constructor(
    @Inject(JobTrackerConstants.JobTrackerRepo)
    public readonly jobTrackerRepo: JobTrackerRepository,
    @Inject(JobTrackerConstants.JobLogsRepo)
    public readonly jobLogRepo: JobLogRepository,
  ) {
    this.dbConn = ObjectionService.connection();
  }
  /**
   * get all jobs or with specific filters
   */

  async getJobs(filters?: GetJobsDto) {
    const { from, status, to, page, perPage, q } = filters;
    const query = this.jobTrackerRepo.query();
    if (filters.status) {
      query.where('jobStatus', filters.status);
    }
    if (filters.from) {
      query.where('startTime', '>=', filters.from);
    }
    if (filters.to) {
      query.where('startTime', '<=', filters.to);
    }
    if (q) {
      // Search on based of region,metric and searchHash
      query.where((builder) => {
        builder.whereILike('jobName', `%${q}%`);
      });
    }
    query.orderBy('createdAt', 'desc');
    const { data, pagination: { total } = { total: 0 } } =
      (await query.paginate(page, perPage)) as any as {
        data: JobTrackerModel[];
        pagination: { total: number };
      };

    return {
      data,
      total,
    };
  }

  /**
   * Fetch job details along with logs
   */
  async getJobWithLogs(jobId: string): Promise<JobTrackerModel> {
    const job = (await this.jobTrackerRepo
      .query()
      .where({
        uuid: jobId,
      })
      .withGraphFetched({ logs: true })
      .first()) as any as JobTrackerModel;
    return job;
  }

  /**
   * retrigger a job
   */
  async retriggerJob(jobId: string) {
    const job = await this.jobTrackerRepo.firstWhere({ uuid: jobId });
    if (!job) {
      throw new Error('Job not found');
    }
    //Dispatch the JOB again with the same data
    try {
      Dispatch({
        job: job.jobName,
        data: job.jobData,
        id: job.uuid,
      });
      return true;
    } catch (e) {
      console.log(`🚀 - JobsService - retriggerJob - e:`, e);

      throw new UnprocessableEntityException('Failed to retrigger job');
    }
  }

  /**
   * Create a new job
   */
  static async createJob(message: Message): Promise<JobTrackerModel> {
    if (!process.env.TRACK_JOBS || +process?.env?.TRACK_JOBS === 0) return;
    if (
      +process?.env?.TRACK_API_EVENT_JOBS === 0 &&
      message.job === 'track_api_events'
    ) {
      return;
    }
    const conn = ObjectionService.connection()(JobTrackerModel.tableName);
    const ifExists = await conn.where('uuid', message.id).first();
    if (ifExists) {
      return await JobsService.updateJobStatus(
        message.id,
        TRACKER_JOB_STATUS.PENDING,
      );
    }
    const newJob = (
      await conn
        .insert({
          uuid: message.id,
          jobName: message.job,
          jobStatus: TRACKER_JOB_STATUS.PENDING,
          jobData: message.data,
          startTime: new Date(),
        })
        .returning('*')
    )[0] as any as JobTrackerModel;

    console.log(`🚀 - JobsService - createJob - newJob:`, newJob);
    return newJob;
  }

  /**
   *  Update the status of a job
   */
  static async updateJobStatus(
    jobId: string,
    status: TRACKER_JOB_STATUS,
  ): Promise<JobTrackerModel> {
    if (!process.env.TRACK_JOBS || +process?.env?.TRACK_JOBS === 0) return;
    // Update the job status
    try {
      const updatedJob = (
        await ObjectionService.connection()(JobTrackerModel.tableName)
          .update({
            jobStatus: status,
            ...(TRACKER_JOB_COMPLETE_STATUSES.includes(status) && {
              endTime: new Date(),
            }), // Mark the end time
          })
          .where('uuid', jobId)
          .returning('*')
      )[0] as any as JobTrackerModel;

      // Log the status update
      await ObjectionService.connection()(JobLogModel.tableName).insert({
        jobId: updatedJob.id,
        log: `Job status updated to ${status}.`,
      });

      return updatedJob;
    } catch (error) {
      console.error(`🚀 - JobsService - error:`, error);
    }
  }
}
