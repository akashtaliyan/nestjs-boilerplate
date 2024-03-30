import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { StandaloneAppOptions } from './interfaces';

export class StandaloneApp {
  private module: any;
  private options: StandaloneAppOptions;
  /**
   * Create instance of fastify lambda server
   * @returns Promise<INestApplication>
   */
  static async make(
    module: any,
    options?: StandaloneAppOptions,
  ): Promise<void> {
    const app = await NestFactory.createApplicationContext(module);

    // Not for eks only for the node process
    if (options?.addValidationContainer) {
      useContainer(app.select(module), { fallbackOnErrors: true });
    }
  }
}
