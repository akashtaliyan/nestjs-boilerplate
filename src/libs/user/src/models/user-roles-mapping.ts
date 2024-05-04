import { BaseModel } from '@libs/nestjs-objection';
import { UserModel } from './user';
import { RolesModel } from './roles';

export class UserRolesMappingModel extends BaseModel {
  static tableName = 'user_roles_mapping';

  uuid?: string;

  userId?: string;

  roleId?: string;

  meta?: Record<string, any>;

  createdAt?: Date;

  updatedAt?: Date;
  role?: RolesModel;

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'user_roles_mapping.userId',
          to: 'users.uuid',
        },
      },
      role: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RolesModel,
        join: {
          from: 'user_roles_mapping.roleId',
          to: 'roles.uuid',
        },
      },
    };
  }
}
