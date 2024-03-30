import { EmitsEvent, Event } from '@libs/nestjs-events';
import { events } from '../constants';

@Event(events.jobFailed)
export class JobFailed extends EmitsEvent {}
