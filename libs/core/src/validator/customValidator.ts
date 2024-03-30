import { CoreConstants } from '../constants';

export function registerCustomValidator(validator: Record<string, any>) {
  return function (...args: string[] | any[]) {
    const properties =
      Reflect.getMetadata(CoreConstants.classOptionalProperties, args[0]) || [];

    const validators =
      Reflect.getMetadata(
        CoreConstants.customValidationDecorators,
        args[0],
        args[1],
      ) || [];

    Reflect.defineMetadata(
      CoreConstants.classOptionalProperties,
      [...properties, args[1]],
      args[0],
    );

    Reflect.defineMetadata(
      CoreConstants.customValidationDecorators,
      [...validators, validator],
      args[0],
      args[1],
    );
  };
}
