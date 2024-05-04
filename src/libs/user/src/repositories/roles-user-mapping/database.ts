import { DatabaseRepository, InjectModel } from '@libs/nestjs-objection';
import { Injectable } from '@nestjs/common';
import { UserRolesMappingModel } from '../../models';
import { UserRolesMappingRepositoryContract } from './contract';

@Injectable()
export class UserRolesMappingRepository
  extends DatabaseRepository<UserRolesMappingModel>
  implements UserRolesMappingRepositoryContract
{
  @InjectModel(UserRolesMappingModel)
  model: UserRolesMappingModel;
}
