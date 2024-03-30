import 'reflect-metadata';
import { ROUTE_NAME } from './constants';

export function WithAlias(name: string) {
  return function (target: Record<string, any>, propertyKey: string) {
    Reflect.defineMetadata(ROUTE_NAME, name, target, propertyKey);
  };
}
