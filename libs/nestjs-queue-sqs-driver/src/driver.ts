import { QueueDriver, InternalMessage } from '@libs/nestjs-queue-strategy';
import AWS = require('aws-sdk');
import { SqsJob } from './job';
import { v4 as uuid } from 'uuid';

export class SqsQueueDriver implements QueueDriver {
  private client: AWS.SQS;
  private queueUrl: string;

  constructor(private options: Record<string, any>) {
    AWS.config.update({ region: options.region });
    let credential;
    if (options.accessKeyId && options.secretAccessKey) {
      credential = new AWS.Credentials({
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      });
    } else if (options.profile) {
      credential = new AWS.SharedIniFileCredentials({
        profile: options.profile,
      });
    } else {
      throw new Error(
        'Please provide either profile or accessKeyId and secretAccessKey',
      );
    }
    AWS.config.credentials = credential;
    this.client = new AWS.SQS({ apiVersion: options.apiVersion });
    this.queueUrl = options.prefix + '/' + options.queue;
  }

  async push(message: string, rawPayload: InternalMessage): Promise<void> {
    const messageHash = uuid();

    const params = {
      MessageBody: message,
      QueueUrl: this.options.prefix + '/' + rawPayload.queue,
      MessageGroupId: messageHash, // made all jobs as separate groups to not block any job if any is invisible.
      MessageDeduplicationId: messageHash,
    } as AWS.SQS.SendMessageRequest;

    await this.client.sendMessage(params).promise().then();
    return;
  }

  async pull(options: Record<string, any>): Promise<SqsJob | null> {
    const params = {
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ['All'],
      QueueUrl: this.options.prefix + '/' + options.queue,
      VisibilityTimeout: 600,
      WaitTimeSeconds: 0,
    };
    const response = await this.client.receiveMessage(params).promise();
    const message = response.Messages ? response.Messages[0] : null;
    return message ? new SqsJob(message) : null;
  }

  async remove(job: SqsJob, options: Record<string, any>): Promise<void> {
    const params = {
      QueueUrl: this.options.prefix + '/' + options.queue,
      ReceiptHandle: job.data.ReceiptHandle,
    };

    await this.client.deleteMessage(params).promise();

    return;
  }

  async purge(options: Record<string, any>): Promise<void> {
    const params = {
      QueueUrl: this.options.prefix + '/' + options.queue,
    };

    await this.client.purgeQueue(params).promise();

    return;
  }

  async count(options: Record<string, any>): Promise<number> {
    const params = {
      QueueUrl: this.options.prefix + '/' + options.queue,
      AttributeNames: ['ApproximateNumberOfMessages'],
    };
    const response: Record<string, any> = await this.client
      .getQueueAttributes(params)
      .promise();
    return +response.Attributes.ApproximateNumberOfMessages;
  }
}
