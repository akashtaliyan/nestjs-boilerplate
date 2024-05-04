import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { BaseValidator } from './basevalidator';
import { CustomValidationPipe } from './validationPipe';
import { ValidatorOptions } from 'class-validator';

export * from './decorators';

export { BaseValidator };

export function Validate(
  DTO: any,
  options: ValidatorOptions = { forbidNonWhitelisted: true },
) {
  return applyDecorators(
    SetMetadata('dtoSchema', DTO),
    SetMetadata('dtoOptions', options), // Add options instead of single option
    UseGuards(CustomValidationPipe),
    ApiBody({ type: DTO }),
  );
}

export const DtoRequestMetaKey = 'dtoRequestObject';

export const Dto = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    Reflect.defineMetadata(DtoRequestMetaKey, request, request._dto);
    return request._dto;
  },
);
