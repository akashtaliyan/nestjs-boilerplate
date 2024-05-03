import { Get, Post, UuidDto } from '@libs/common';
import { Request, Response, RestController } from '@libs/core';
import { Dto, Validate } from '@libs/core/validator';
import { Controller, Req, Res } from '@nestjs/common';

import { JobsLTransformer } from '@libs/common/transformers/admin/jobs-Manager';
import { GetJobsDto } from '@libs/jobs/validators';
import { JobsManagerApisService } from './JobsManagerApisService';

@Controller('admin/jobs-manager')
export class JobsManagerApisController extends RestController {
  constructor(private readonly jobApiService: JobsManagerApisService) {
    super();
  }

  // get job List
  @Get('jobs')
  // @Permissions(ADMIN_ONLY)
  @Validate(GetJobsDto)
  async getFeatureList(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: GetJobsDto,
  ): Promise<any> {
    const jobs = await this.jobApiService.getAllJobs(inputs);
    return res.success({
      data: await this.collection(jobs.data, new JobsLTransformer(), {
        req,
      }),
      total: jobs.total,
    });
  }

  @Get('jobs/:id')
  @Validate(UuidDto)
  // @Permissions(ADMIN_ONLY)
  async getFeaturesForCompany(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: UuidDto,
  ): Promise<any> {
    const job = await this.jobApiService.getSingleJob(inputs);
    res.success(job);
  }

  @Post('jobs/retrigger')
  // @Permissions(ADMIN_ONLY)
  @Validate(UuidDto)
  async retriggerJob(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: UuidDto,
  ): Promise<any> {
    const job = this.jobApiService.retriggerJob(inputs);
    res.success(job);
  }
}
