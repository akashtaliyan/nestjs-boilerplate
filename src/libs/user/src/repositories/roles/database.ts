import { RolesModel, UserModel } from '../../models';
import { Injectable } from '@nestjs/common';
import { RolesRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@libs/nestjs-objection';

@Injectable()
export class RolesRepository
  extends DatabaseRepository<RolesModel>
  implements RolesRepositoryContract
{
  @InjectModel(RolesModel)
  model: RolesModel;
}
