import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { DbOperationsCommand } from './commands/migrations';
import { NestObjection } from './constants';
import {
  DatabaseAsyncOptions,
  DatabaseAsyncOptionsFactory,
  DatabaseOptions,
} from './options';
import { ObjectionService } from './service';
import { ExistsConstraint, IsUniqueConstraint } from './validators';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class ObjectionModule {
  /**
   * Register options
   * @param options
   */
  static register(options: DatabaseOptions): DynamicModule {
    return {
      global: options.isGlobal || false,
      module: ObjectionModule,
      imports: [DiscoveryModule],
      providers: [
        ObjectionService,
        ExistsConstraint,
        DbOperationsCommand,
        IsUniqueConstraint,
        { provide: NestObjection.databaseOptions, useValue: options },
      ],
      exports: [],
    };
  }

  /**
   * Register Async Options
   */
  static registerAsync(options: DatabaseAsyncOptions): DynamicModule {
    return {
      global: options.isGlobal || false,
      module: ObjectionModule,
      imports: [DiscoveryModule],
      providers: [
        this.createOptionsProvider(options),
        ObjectionService,
        ExistsConstraint,
        IsUniqueConstraint,
        DbOperationsCommand,
      ],
      exports: [],
    };
  }

  private static createOptionsProvider(
    options: DatabaseAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: NestObjection.databaseOptions,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<DatabaseOptions>,
    ];

    return {
      provide: NestObjection.databaseOptions,
      useFactory: async (optionsFactory: DatabaseAsyncOptionsFactory) =>
        await optionsFactory.createOptions(),
      inject,
    };
  }
}
