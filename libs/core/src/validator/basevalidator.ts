import { startCase, isEmpty } from 'lodash';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Injectable, Type } from '@nestjs/common';
import { ValidationFailed } from '../exceptions';
import { Context } from '../utils';
import { Request } from '../rest';
import { CoreConstants } from '../constants';

@Injectable()
export class BaseValidator {
  private context: Context;

  constructor() {
    this.context = new Context();
  }

  setContext(req: Request): BaseValidator {
    this.context.setRequest(req.getContext());
    return this;
  }

  async fire<T>(
    inputs: Record<string, any>,
    schemaMeta: Type<T>,
    options?: ValidatorOptions, // override default options
  ): Promise<T> {
    const schema = this.buildSchema(inputs, schemaMeta);

    const errors = await validate(schema as Record<string, any>, {
      stopAtFirstError: true,
      forbidUnknownValues: false, // handle empty values validation.
      whitelist: true,
      ...options, // override default options
    });

    this.processErrors(errors);
    delete schema['$'];
    return schema;
  }

  /**
   * Build schema from a POJO
   * @param inputs
   * @param schemaMeta
   */
  buildSchema<T>(inputs: Record<string, any>, schemaMeta: Type<T>): T {
    // const $ = { ...this.context.getRequest() };
    const schemaPayload = { ...inputs };
    const schema: T = plainToClass(schemaMeta, schemaPayload);

    const properties =
      Reflect.getMetadata(CoreConstants.classOptionalProperties, schema) || [];

    if (properties.length > 0) {
      const dtoKeys = Object.getOwnPropertyNames(schema);
      const dtoKeysMap = {};
      for (const key of dtoKeys) dtoKeysMap[key] = true;
      for (const property of properties) {
        const validators = Reflect.getMetadata(
          CoreConstants.customValidationDecorators,
          schema,
          property,
        );
        for (const validator of validators) {
          validator.fn(schema, { value: validator.value, property });
        }
      }
    }

    return schema;
  }

  /**
   * Process errors, if any.
   * Throws new ValidationFailed Exception with validation errors
   */
  processErrors(errors: ValidationError[]): void {
    let bag = {};
    if (errors.length > 0) {
      for (const error of errors) {
        const errorsFromParser = this.parseError(error);
        const childErrorBag = {};
        for (const key in errorsFromParser) {
          if (!isEmpty(errorsFromParser[key])) {
            childErrorBag[key] = errorsFromParser[key];
          }
        }

        bag = { ...bag, ...childErrorBag };
      }

      throw new ValidationFailed(bag);
    }
  }

  parseError(error: ValidationError) {
    const children = [];
    for (const child of error.children || []) {
      children.push(this.parseError(child));
    }

    const messages = [];
    for (const c in error.constraints) {
      let message = error.constraints[c];
      message = message.replace(error.property, startCase(error.property));
      messages.push(message);
    }

    const errors = {};
    if (!isEmpty(messages)) {
      errors[error.property] = messages;
    }

    for (const child of children) {
      for (const key in child) {
        errors[`${error.property}.${key}`] = child[key];
      }
    }

    return errors;
  }
}
