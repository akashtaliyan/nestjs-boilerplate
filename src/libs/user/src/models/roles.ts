import { BaseModel } from '@libs/nestjs-objection';

export class RolesModel extends BaseModel {
  static tableName = 'roles';

  uuid?: string;

  name?: string;

  meta?: Record<string, any>;

  createdAt?: Date;

  updatedAt?: Date;
}
