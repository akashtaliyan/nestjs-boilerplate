import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { NestConsoleConstants } from './constants';
import { CommandMetaOptions, GenericFunction } from './interfaces';
import { CommandMeta } from './metadata';

@Injectable()
export class ConsoleExplorer {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onModuleInit() {
    const wrappers = this.discovery.getProviders();
    wrappers.forEach((w) => {
      const { instance } = w;
      if (
        !instance ||
        typeof instance === 'string' ||
        !Object.getPrototypeOf(instance)
      ) {
        return;
      }

      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (key: string) => this.lookupConsoleCommands(instance, key),
      );
    });
  }

  lookupConsoleCommands(
    instance: Record<string, GenericFunction>,
    key: string,
  ) {
    const methodRef = instance[key];
    const hasCommandMeta = Reflect.hasMetadata(
      NestConsoleConstants.commandName,
      instance,
      key,
    );
    const isClassConsoleCommand = Reflect.hasMetadata(
      NestConsoleConstants.commandName,
      instance.constructor,
    );

    if (!hasCommandMeta && !isClassConsoleCommand) return;

    if (isClassConsoleCommand && key != 'handle') return;

    const command =
      Reflect.getMetadata(NestConsoleConstants.commandName, instance, key) ||
      Reflect.getMetadata(
        NestConsoleConstants.commandName,
        instance.constructor,
      );

    const options: CommandMetaOptions =
      Reflect.getMetadata(NestConsoleConstants.commandOptions, instance, key) ||
      Reflect.getMetadata(
        NestConsoleConstants.commandOptions,
        instance.constructor,
      );

    CommandMeta.setCommand(command, options, methodRef.bind(instance));
  }
}
