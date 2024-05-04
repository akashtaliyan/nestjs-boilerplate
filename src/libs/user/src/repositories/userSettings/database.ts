import { Injectable } from '@nestjs/common';

import { DatabaseRepository, InjectModel } from '@libs/nestjs-objection';
import { UserSettingsRepositoryContract } from './contract';
import { UserSettingsModel } from '../../models/userSettings';

@Injectable()
export class UserSettingsRepository
  extends DatabaseRepository<UserSettingsModel>
  implements UserSettingsRepositoryContract
{
  @InjectModel(UserSettingsModel)
  model: UserSettingsModel;
}
