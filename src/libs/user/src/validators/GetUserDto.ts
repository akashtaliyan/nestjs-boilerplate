import {
  IsEmail,
  IsOptional,
  IsUUID,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsEitherOr', async: false })
class IsEitherOrConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value !== undefined || relatedValue !== undefined;
  }

  defaultMessage(args: ValidationArguments) {
    return `Either "${args.property}" or "${args.constraints[0]}" must be provided.`;
  }
}

export class GetUserByIdOrEmailDto {
  @IsOptional()
  @IsUUID('4', { message: 'The ID must be a valid UUID.' })
  @Validate(IsEitherOrConstraint, ['email'], {
    message: 'Either id or email must be provided.',
  })
  id?: string;

  @IsOptional()
  @IsEmail({}, { message: 'The email must be a valid email address.' })
  @Validate(IsEitherOrConstraint, ['id'], {
    message: 'Either email or id must be provided.',
  })
  email?: string;
}
