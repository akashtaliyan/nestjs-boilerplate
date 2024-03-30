import { EmitsEvent, Event } from '@libs/nestjs-events';
import { events } from '../constants';

@Event(events.jobProcessed)
export class JobProcessed extends EmitsEvent {}
