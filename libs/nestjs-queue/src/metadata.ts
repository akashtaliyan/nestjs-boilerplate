import { Inject, Injectable } from '@nestjs/common';
import { JobOptions } from '@libs/nestjs-queue-strategy';
import { QUEUE_OPTIONS } from './constants';
import { QueueOptions } from './interfaces';

interface JobTarget {
  options: JobOptions;
  target: (...args: any[]) => any;
}

@Injectable()
export class QueueMetadata {
  private static data: QueueOptions;
  private static defaultOptions: Record<string, string | number | undefined>;
  private static store: Record<string, any> = { jobs: {} };

  constructor(@Inject(QUEUE_OPTIONS) data: QueueOptions) {
    QueueMetadata.data = data;
    QueueMetadata.defaultOptions = {
      connection: data.default,
      queue: data.connections[data.default].queue as string,
      delay: 0,
      tries: 5,
      timeout: 30,
      sleep: 10,
    };
  }

  static getDefaultOptions(): Record<string, any> {
    return QueueMetadata.defaultOptions;
  }

  static getData(): QueueOptions {
    return QueueMetadata.data;
  }

  static addJob(jobName: string, target: JobTarget): void {
    QueueMetadata.store.jobs[jobName] = target;
  }

  static getJob(jobName: string): JobTarget {
    return QueueMetadata.store.jobs[jobName];
  }
}
