import 'reflect-metadata';
import { NestEventConstants } from './constants';
import { GenericClass } from './interfaces';

export function Event(name?: string) {
  return function (target: GenericClass) {
    Reflect.defineMetadata(
      NestEventConstants.eventEmitterName,
      name || target['name'],
      target,
    );
  };
}

export function ListensTo(event: string | GenericClass) {
  const eventName = typeof event === 'string' ? event : event['name'];
  return function (
    target: Record<string, any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    Reflect.defineMetadata(
      NestEventConstants.eventName,
      eventName,
      target,
      propertyKey,
    );
  };
}
