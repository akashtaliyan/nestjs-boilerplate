import { DynamicModule, HttpException, Module } from '@nestjs/common';
import { IOptions } from '@nyariv/sandboxjs';
import { JsForgeService } from './service';
import { JsForgeConstants } from './constants';

@Module({})
export class JsForgeModule {
  /**
   * Register options
   * @param options
   */
  static register(
    options: Partial<IOptions> = {},
    global = false,
  ): DynamicModule {
    const _options = {
      executionQuota: 10000n,
      onExecutionQuotaReached: () => {
        throw new HttpException('Execution time exceeded for script', 508);
      },
      ...options,
    };
    return {
      global: global,
      module: JsForgeModule,
      imports: [],
      providers: [
        { provide: JsForgeConstants.OPTIONS, useValue: _options },
        JsForgeService,
      ],
      exports: [JsForgeService],
    };
  }
}
