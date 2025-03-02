import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isEmpty, isArray, isObject } from 'lodash';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
@ValidatorConstraint({ async: false })
export class IsValueFromConfigConstraint
  implements ValidatorConstraintInterface
{
  constructor(private config: ConfigService) {}

  validate(passedValue: string, args: ValidationArguments): boolean {
    const [options] = args.constraints;
    const validValues = this.getValues(options.key);

    console.log(validValues, passedValue);
    if (isEmpty(validValues) || !isArray(validValues)) {
      return false;
    }

    const valueKeys = {};
    for (const validValue of validValues) valueKeys[validValue] = 1;

    if (!isArray(passedValue) && validValues.includes(passedValue)) {
      return true;
    } else if (isArray(passedValue)) {
      if (passedValue.length == 0) return;
      for (const value of passedValue) {
        if (!valueKeys[value]) {
          return false;
        }
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [options] = args.constraints;
    const validValues = this.getValues(options.key);
    return `${args.property} should have either of ${validValues.join(
      ', '
    )} as value`;
  }

  private getValues(key: string): any {
    let validValues: Array<string> = this.config.get(key);
    if (isObject(validValues)) {
      validValues = Object.values(validValues);
    }

    return validValues;
  }
}

export function IsValueFromConfig(
  options: Record<string, any>,
  validationOptions?: ValidationOptions
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsValueFromConfigConstraint,
    });
  };
}
