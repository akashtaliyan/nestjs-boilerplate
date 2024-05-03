import { EmitsEvent, Event } from '@libs/nestjs-events';
import { events } from '../constants';
import { JobsService } from '@libs/jobs';
import { TRACKER_JOB_STATUS } from '@libs/jobs/constants';

@Event(events.jobProcessing)
export class JobProcessing extends EmitsEvent {
  constructor(
    public message: any,
    public job: any,
  ) {
    super();
    JobsService.updateJobStatus(message.id, TRACKER_JOB_STATUS.RUNNING);
  }
}
