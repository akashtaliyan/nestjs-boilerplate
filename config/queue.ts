import { QueueOptions } from '@libs/nestjs-queue';
import { SqsQueueDriver } from '@libs/nestjs-queue-sqs-driver';
import { registerAs } from '@nestjs/config';

export default registerAs('queue', () => {
  return {
    default: 'queue',
    connections: {
      queue: {
        driver: SqsQueueDriver,
        apiVersion: 'v1',
        profile: process.env.AWS_PROFILE || '',
        prefix: process.env.AWS_SQS_PREFIX || '',
        queue: process.env.AWS_SQS_QUEUE || '',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        suffix: '',
        region: process.env.AWS_REGION || 'us-east-1',
      },
      externalWorkerQueue: {
        driver: SqsQueueDriver,
        apiVersion: 'v1',
        profile: process.env.AWS_PROFILE_FOR_EXTERNAL_WORKER || '',
        prefix: process.env.AWS_SQS_PREFIX_FOR_EXTERNAL_WORKER || '',
        queue: process.env.AWS_SQS_AUTOMATION_QUEUE || '',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        suffix: '',
        region: process.env.AWS_REGION_FOR_EXTERNAL_WORKER || '',
      },
    },
  } as QueueOptions;
});
