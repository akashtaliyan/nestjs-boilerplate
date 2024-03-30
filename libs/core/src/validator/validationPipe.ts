import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseValidator } from './basevalidator';
import { ValidatorOptions } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const schema = this.reflector.get('dtoSchema', context.getHandler());
    const dtoOptions = this.reflector.get<ValidatorOptions>(
      'dtoOptions',
      context.getHandler(),
    );
    const validator = new BaseValidator();

    validator.setContext(req);
    req._dto = await validator.fire(req.all(), schema, dtoOptions);

    return true;
  }
}
