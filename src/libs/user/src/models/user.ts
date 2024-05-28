import { BaseModel } from '@libs/nestjs-objection';
import { RolesModel } from './roles';

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

  static get relationMappings() {
    return {
      roles: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: RolesModel,
        join: {
          from: 'users.id',
          through: {
            from: 'user_roles_mapping.userId',
            to: 'user_roles_mapping.roleId',
          },
          to: 'roles.id',
        },
      },
    };
  }
}

export enum PROVIDERS_ENUM {
  GOOGLE = 'google',
  GITHUB = 'github',
}
