import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EXTERNAL_PROVIDERS } from '../constants';

export class UuidDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class dropdownsTypeDto {
  @IsString()
  @IsNotEmpty()
  type: string;
}

// validations for authorize external integration api.
export class Oauth2CallbackDto {
  @IsIn(Object.values(EXTERNAL_PROVIDERS))
  @IsNotEmpty()
  @IsString()
  provider: string;

  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  scope: string;
}
export class OauthUrlDto {
  @IsIn(Object.values(EXTERNAL_PROVIDERS))
  @IsNotEmpty()
  @IsString()
  provider: string;
}
