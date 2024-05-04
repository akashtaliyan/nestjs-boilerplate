import { RepositoryContract } from '@libs/nestjs-objection';
import { RolesModel } from '../../models';

export interface RolesRepositoryContract
  extends RepositoryContract<RolesModel> {}
