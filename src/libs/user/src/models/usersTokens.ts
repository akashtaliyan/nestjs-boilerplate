import { BaseModel } from '@libs/nestjs-objection';

export class UsersTokensModel extends BaseModel {
  static tableName = 'users_tokens';

  userId: string;

  token: string;

  clientInfo?: Record<string, any>;

  lastUsed?: Date;

  expiryDate: Date;

  isExpired?: boolean;

  meta?: Record<string, any>;

  createdAt?: Date;

  updatedAt?: Date;
}
