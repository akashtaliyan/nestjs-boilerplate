import { RepositoryContract } from '@libs/nestjs-objection';
import { UserRolesMappingModel } from '../../models';

export interface UserRolesMappingRepositoryContract
  extends RepositoryContract<UserRolesMappingModel> {}
