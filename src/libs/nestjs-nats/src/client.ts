import { Logger } from '@nestjs/common';
import { isObject, omit } from 'lodash';
import {
  JetStreamClient,
  JetStreamManager,
  JetStreamPublishOptions,
  NatsConnection,
  Payload,
  PublishOptions,
  connect,
} from 'nats';
import { NatsClientOptions } from './options';

export class NatsClient {
  public nc: NatsConnection;
  public jsm: JetStreamManager;
  public jsc: JetStreamClient;
  public logger: Logger;

  constructor(private options: NatsClientOptions) {
    this.logger = new Logger(`${NatsClient.name}`);
  }

  async connect() {
    if (this?.nc?.isClosed() !== undefined && !this?.nc?.isClosed())
      return this;
    try {
      const nc = await connect({
        ...omit(this?.options?.connectionOptions || this?.options || {}, [
          'debug',
        ]),
        maxReconnectAttempts: 5, // default is 5
        maxPingOut: 5,
        reconnectDelayHandler: () => 1000,
        reconnectTimeWait: 1000,
      });

      this.logger.log(`Connected to ${nc.getServer()}`);
      this.nc = nc;
      this.jsm = await this.nc.jetstreamManager();
      this.jsc = this.nc.jetstream();
      this.handleStatusUpdates(nc);
      return this;
    } catch (e) {
      this.logger.error(`Error connecting to nats: ${e.message}`);
    }
  }

  publish(subject: string, payload?: Payload, options?: PublishOptions) {
    if (!this.jsc) {
      this.connect().then(() => this.publish(subject, payload, options));
      return;
    }
    this.nc.publish(subject, payload, options);
  }

  async publishToStream(
    subject: string,
    payload?: Payload,
    options?: Partial<JetStreamPublishOptions>,
  ) {
    if (!this.jsc) await this.connect();
    if (this?.nc?.isClosed()) {
      this.logger.error('Nats connection is closed');
      this.logger.error('Unable to publish message to stream');
      return;
    }
    return await this.jsc.publish(subject, payload, options);
  }

  async handleStatusUpdates(client: NatsConnection) {
    for await (const status of client.status()) {
      const data =
        status.data && isObject(status.data)
          ? JSON.stringify(status.data)
          : status.data;

      switch (status.type) {
        case 'error':
        case 'disconnect':
          this.logger.error(
            `NatsError: type: "${status.type}", data: "${data}".`,
          );
          break;

        case 'pingTimer':
          if (this.options.debug) {
            this.logger.debug(
              `NatsStatus: type: "${status.type}", data: "${data}".`,
            );
          }
          break;

        default:
          if (this.options.debug)
            this.logger.log(
              `NatsStatus: type: "${status.type}", data: "${data}".`,
            );
          break;
      }
    }
  }
}
