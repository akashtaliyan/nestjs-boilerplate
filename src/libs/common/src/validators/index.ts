import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

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
  @IsIn(['google'])
  @IsNotEmpty()
  @IsString()
  provider: ['google'];

  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  scope: string;
}
