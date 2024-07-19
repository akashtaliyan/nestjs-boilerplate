import { RepositoryContract } from '@libs/nestjs-objection';
import { ExternalAccountModel } from '../../models';

export interface ExternalAccountRepositoryContract
  extends RepositoryContract<ExternalAccountModel> {}
