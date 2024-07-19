import { registerAs } from '@nestjs/config';
import { NatsClientOptions } from '@src/libs/nestjs-nats/src';

export default registerAs(
  'nats',
  () =>
    ({
      connectionOptions: {
        servers: process.env?.NATS_SERVERS?.split(',') || [],
      },
      debug: !!+process.env.NATS_DEBUG,
      auditSubject: process.env.NATS_AUDIT_SUBJECT || 'audit_events',
      isAuditEnabled: !!+process.env.NATS_AUDIT_ENABLED,
    }) satisfies NatsClientOptions,
);
