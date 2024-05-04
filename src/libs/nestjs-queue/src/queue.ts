import { Message } from '@libs/nestjs-queue-strategy';
import { v4 as uuidv4 } from 'uuid';
import { PayloadBuilder } from './core';
import { QueueMetadata } from './metadata';
import { QueueService } from './service';
import { JobsService } from '@libs/jobs';
export class Queue {
  static async dispatch(message: Message): Promise<void> {
    const jobId = message?.id || uuidv4();
    message.id = jobId;
    // create a new job processing event
    JobsService.createJob(message);
    const job = QueueMetadata.getJob(message.job);
    const payload = PayloadBuilder.build(message, job?.options ?? {});
    const connection = QueueService.getConnection(payload['connection']);
    return connection.push(JSON.stringify(payload), payload);
  }
}

export function Dispatch(message: Message): Promise<void> {
  const jobId = message?.id || uuidv4();
  message.id = jobId;
  // create a new job processing event
  JobsService.createJob(message);
  const job = QueueMetadata.getJob(message.job);
  const payload = PayloadBuilder.build(message, job?.options ?? {});
  const connection = QueueService.getConnection(payload.connection);
  return connection.push(JSON.stringify(payload), payload);
}
