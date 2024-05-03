import { Injectable } from '@nestjs/common';
import { UserSettingsModel } from '@src/user/models/userSettings';
import { DatabaseRepository, InjectModel } from '@libs/nestjs-objection';
import { UserSettingsRepositoryContract } from './contract';

@Injectable()
export class UserSettingsRepository
  extends DatabaseRepository<UserSettingsModel>
  implements UserSettingsRepositoryContract
{
  @InjectModel(UserSettingsModel)
  model: UserSettingsModel;
}
