import { CreateUserDto } from '@src/user';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
export { CreateUserDto as SignUpEmailDto };

export class LoginWithEmailDto {
  @IsEmail()
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
}
