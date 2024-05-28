import { RepositoryContract } from '@libs/nestjs-objection';
import { RolesModel, UsersTokensModel } from '../../models';

export interface UsersTokensRepositoryContract
  extends RepositoryContract<UsersTokensModel> {}
