import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isEmpty } from 'lodash';
import moment, { Moment } from 'moment';

@Injectable()
@ValidatorConstraint()
export class ValidDateConstraint implements ValidatorConstraintInterface {
  public validate(
    value: string | Date | Moment,
    args: ValidationArguments,
  ): boolean {
    if (!value && isEmpty(value)) return false;

    const valueMoment = moment(value);

    if (!valueMoment.isValid()) return false;

    args.object[args.property] = valueMoment.toDate();

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const key = args.property;
    if (!args.value && isEmpty(args.value)) return `${key} is required.`;

    return `${key} is not valid date.`;
  }
}

@Injectable()
@ValidatorConstraint()
export class MaxDateConstraint implements ValidatorConstraintInterface {
  public validate(
    value: string | Date | Moment,
    args: ValidationArguments,
  ): boolean {
    if (!value && isEmpty(value)) return false;

    const valueMoment = moment(value);

    if (!valueMoment.isValid()) return false;

    const [{ before = null } = {}]: DateValidatorOptions[] = args.constraints;

    if (before && valueMoment.isAfter(before(args.object))) return false;

    args.object[args.property] = valueMoment.toDate();

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const key = args.property;
    if (!args.value && isEmpty(args.value)) return `${key} is required.`;
    if (!moment(args.value).isValid()) return `${key} is not valid date.`;

    const [{ before = null } = {}]: DateValidatorOptions[] = args.constraints;

    return `${key} must be before ${moment(before(args.object)).format(
      'YYYY-MM-DD',
    )}`;
  }
}

@Injectable()
@ValidatorConstraint()
export class MinDateConstraint implements ValidatorConstraintInterface {
  public validate(
    value: string | Date | Moment,
    args: ValidationArguments,
  ): boolean {
    if (!value && isEmpty(value)) return false;

    const valueMoment = moment(value);

    if (!valueMoment.isValid()) return false;

    const [{ after = null } = {}]: DateValidatorOptions[] = args.constraints;

    if (after && valueMoment.isBefore(after(args.object))) return false;

    args.object[args.property] = valueMoment.toDate();

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const key = args.property;
    if (!args.value && isEmpty(args.value)) return `${key} is required.`;
    if (!moment(args.value).isValid()) return `${key} is not valid date.`;

    const [{ after = null } = {}]: DateValidatorOptions[] = args.constraints;

    return `${key} must be after ${moment(after(args.object)).format(
      'YYYY-MM-DD',
    )}`;
  }
}

export function MinDate(
  value: (obj?: Record<string, any>) => string | Date | Moment,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [{ after: value }],
      validator: MinDateConstraint,
    });
  };
}
export function MaxDate(
  value: (obj?: Record<string, any>) => string | Date | Moment,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [{ before: value }],
      validator: MaxDateConstraint,
    });
  };
}

export function IsDate(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidDateConstraint,
    });
  };
}

interface DateValidatorOptions {
  after?: (obj?: Record<string, any>) => Date | Moment;
  before?: (obj?: Record<string, any>) => Date | Moment;
  equal?: Date | Moment;
}
