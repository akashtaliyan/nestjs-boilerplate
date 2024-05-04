import {
  DriverJob,
  InternalMessage,
  QueueDriver,
} from '@libs/nestjs-queue-strategy';
import { QueueMetadata } from '../metadata';

export class SyncQueueDriver implements QueueDriver {
  async push(message: string, rawPayload: InternalMessage): Promise<void> {
    const job = QueueMetadata.getJob(rawPayload.job);
    job.target(rawPayload.data);
    return;
  }

  async pull(): Promise<DriverJob | null> {
    return null;
  }

  async remove(): Promise<void> {
    return;
  }

  async purge(): Promise<void> {
    return;
  }

  async count(): Promise<number> {
    return 0;
  }
}
