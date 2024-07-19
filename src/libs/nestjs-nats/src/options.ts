import { ModuleMetadata } from '@nestjs/common';
import { ConnectionOptions } from 'nats';

export interface NatsClientOptions {
  connectionOptions?: ConnectionOptions;
  debug?: boolean;
  auditSubject?: string;
  isAuditEnabled?: boolean;
}
