import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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
