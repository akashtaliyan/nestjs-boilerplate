import { CreateUserDto } from '@src/libs/user/src';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';

export class AddRoleDto {
  @IsUUID()
  @IsOptional()
  id: string;
  @IsString()
  role: string;
}

export class DeleteRoleDto {
  @IsUUID()
  id: string;
}

export class AssignOrRevokeRoleDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  roleId: string;
}
