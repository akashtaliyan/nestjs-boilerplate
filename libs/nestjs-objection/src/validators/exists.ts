import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, Type } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ObjectionService } from '../service';
import { BaseModel } from '../baseModel';
import { QueryBuilder } from 'objection';

@Injectable()
@ValidatorConstraint({ async: true })
export class ExistsConstraint implements ValidatorConstraintInterface {
  public async validate(
    value: string | string[],
    args: ValidationArguments,
  ): Promise<boolean> {
    if (!value && isEmpty(value)) return false;

    const [
      { table, column, caseInsensitive, where, model, modelProp, modifier },
    ]: IExistsOptions[] = args.constraints;
    if (caseInsensitive) {
      value = Array.isArray(value)
        ? value.map((v) => v.toLowerCase())
        : value.toLowerCase();
    }

    let query = ObjectionService.connection().table(table);
    Array.isArray(value)
      ? query.whereIn(column, value)
      : query.where(column, value);

    if (where) query.where(where);
    if (modifier) query = modifier(query as any);

    const result = await query;

    if (Array.isArray(value) && result.length !== value.length) {
      return false;
    } else if (result.length == 0) {
      return false;
    }

    if (!model) return true;

    const records = result.map((s) => {
      const m = new model();
      return m.$setJson(s);
    });

    const propName = modelProp || args.property;
    if (model) {
      if (Array.isArray(value)) {
        args.object[propName] = records;
      } else {
        args.object[propName] = records[0];
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [options] = args.constraints;
    return `${options.column} does not exist.`;
  }
}

export function Exists(
  options: IExistsOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: ExistsConstraint,
    });
  };
}

interface IExistsOptions {
  table: string;
  column?: string;
  caseInsensitive?: boolean;
  where?: Record<string, any>;
  model?: Type<BaseModel>;
  modelProp?: string;
  modifier?: (query: QueryBuilder<any>) => any;
}
