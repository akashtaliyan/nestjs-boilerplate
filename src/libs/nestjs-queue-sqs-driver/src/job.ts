import { DriverJob } from '@libs/nestjs-queue-strategy';

export class SqsJob extends DriverJob {
  public getMessage(): string {
    return this.data.Body;
  }
}
