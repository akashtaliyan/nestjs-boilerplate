import { ExternalAccountModel, RolesModel, UserModel } from '../../models';
import { Injectable } from '@nestjs/common';
import { ExternalAccountRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@libs/nestjs-objection';

@Injectable()
export class ExternalAccountRepository
  extends DatabaseRepository<ExternalAccountModel>
  implements ExternalAccountRepositoryContract
{
  @InjectModel(ExternalAccountModel)
  model: ExternalAccountModel;
}
