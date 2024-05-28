import { RolesModel, UserModel, UsersTokensModel } from '../../models';
import { Injectable } from '@nestjs/common';
import { UsersTokensRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@libs/nestjs-objection';

@Injectable()
export class UsersTokensRepository
  extends DatabaseRepository<UsersTokensModel>
  implements UsersTokensRepositoryContract
{
  @InjectModel(UsersTokensModel)
  model: UsersTokensModel;
}
