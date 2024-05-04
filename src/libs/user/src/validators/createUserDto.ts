import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { IsMatch } from './'; // Adjust the import path as necessary

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
