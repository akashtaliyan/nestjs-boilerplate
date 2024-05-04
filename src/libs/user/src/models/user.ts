import { BaseModel } from '@libs/nestjs-objection';

export class UserModel extends BaseModel {
  static tableName = 'users';

  uuid?: string;

  username?: string;

  firstName?: string;
  lastName?: string;

  email?: string;
  passwordHash?: string;

  designation?: string;

  isEmailVerified?: boolean;

  isDeleted?: boolean;

  provider?: PROVIDERS_ENUM;

  meta?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum PROVIDERS_ENUM {
  GOOGLE = 'google',
  GITHUB = 'github',
}
