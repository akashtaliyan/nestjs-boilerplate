import { EmitsEvent, Event } from '@libs/nestjs-events';
import { events } from '../constants';

@Event(events.jobProcessing)
export class JobProcessing extends EmitsEvent {}
