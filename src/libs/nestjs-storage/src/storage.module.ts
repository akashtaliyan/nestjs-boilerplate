import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import {
  StorageAsyncOptions,
  StorageOptions,
  StorageOptionsFactory,
} from './interfaces';
import { map } from './provider.map';
import { StorageService } from './storage.service';

@Module({
  providers: [],
  exports: [],
})
export class StorageModule {
  static register(options: StorageOptions): DynamicModule {
    return {
      global: true,
      module: StorageModule,
      providers: [
        StorageService,
        {
          provide: map.STORAGE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  static registerAsync(options: StorageAsyncOptions): DynamicModule {
    return {
      global: true,
      module: StorageModule,
      providers: [this.createStorageOptionsProvider(options), StorageService],
    };
  }

  private static createStorageOptionsProvider(
    options: StorageAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: map.STORAGE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<StorageOptions>,
    ];
    return {
      provide: map.STORAGE_OPTIONS,
      useFactory: async (optionsFactory: StorageOptionsFactory) =>
        await optionsFactory.createStorageOptions(),
      inject,
    };
  }
}
