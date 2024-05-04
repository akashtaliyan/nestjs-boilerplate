import { EmitsEvent, Event } from '@libs/nestjs-events';
import { events } from '../constants';
import { TRACKER_JOB_STATUS } from '@libs/jobs/constants';
import { JobsService } from '@libs/jobs';
@Event(events.jobProcessed)
export class JobProcessed extends EmitsEvent {
  constructor(
    public message: any,
    public job: any,
  ) {
    super();
    JobsService.updateJobStatus(message.id, TRACKER_JOB_STATUS.SUCCESS);
  }
}
