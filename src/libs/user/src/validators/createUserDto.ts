import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsMatch } from './'; // Adjust the import path as necessary
import { ROLES } from '@libs/common/constants/roles';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string;

  @IsEmail({}, { message: 'The email must be a valid email address.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'The password must be at least 8 characters long.' })
  @Matches(/(?=.*[a-z])/, {
    message: 'The password must contain at least one lowercase letter.',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'The password must contain at least one uppercase letter.',
  })
  @Matches(/(?=.*\d)/, {
    message: 'The password must contain at least one number.',
  })
  @Matches(/(?=.*[\W])/, {
    message: 'The password must contain at least one special character.',
  })
  password: string;

  @IsString()
  @IsMatch('password', { message: 'Confirm password does not match.' })
  confirmPassword: string;
}

export class CreateUpdateAdminUserDto {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string;

  @IsEmail({}, { message: 'The email must be a valid email address.' })
  @ValidateIf((o) => !o.id)
  email: string;

  @IsString()
  @MinLength(8, { message: 'The password must be at least 8 characters long.' })
  @Matches(/(?=.*[a-z])/, {
    message: 'The password must contain at least one lowercase letter.',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'The password must contain at least one uppercase letter.',
  })
  @Matches(/(?=.*\d)/, {
    message: 'The password must contain at least one number.',
  })
  @Matches(/(?=.*[\W])/, {
    message: 'The password must contain at least one special character.',
  })
  password: string;

  @IsIn(Object.values(ROLES), { each: true })
  roles: string[];
}
