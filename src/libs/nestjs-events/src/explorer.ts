import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { NestEventConstants } from './constants';
import { EventMetadata } from './metadata';

@Injectable()
export class EventExplorer {
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
        (key: string) => this.lookupListeners(instance, key),
      );
    });
  }

  lookupListeners(instance: Record<string, any>, key: string) {
    const methodRef = instance[key];
    const hasEventMeta = Reflect.hasMetadata(
      NestEventConstants.eventName,
      instance,
      key,
    );
    if (!hasEventMeta) return;
    const eventName = Reflect.getMetadata(
      NestEventConstants.eventName,
      instance,
      key,
    );
    EventMetadata.addListener(eventName, methodRef.bind(instance));
  }
}
