import 'reflect-metadata';
import { CoreConstants } from '@libs/core/constants';
import { registerCustomValidator } from '../customValidator';

const defaultValueFunction = (value: any) => ({
  validator: 'default_validator',
  value,
  fn: (dto: any, args: { value: any; property: string }) => {
    const properties = Reflect.getMetadata(
      CoreConstants.classOptionalProperties,
      dto,
    );

    if (properties.length == 0) return true;

    const dtoKeys = Object.getOwnPropertyNames(dto);
    const dtoKeysMap = {};
    for (const key of dtoKeys) dtoKeysMap[key] = true;

    if (dtoKeysMap[args.property]) return;
    dto[args.property] =
      typeof args.value === 'function' ? args.value(dto) : args.value; // Add support for functions as default values
  },
});

export function DefaultValue(value: any) {
  return registerCustomValidator(defaultValueFunction(value));
}
