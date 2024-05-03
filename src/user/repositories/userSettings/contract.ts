import { UserSettingsModel } from '@src/user/models/userSettings';
import { RepositoryContract } from '@libs/nestjs-objection';

export interface UserSettingsRepositoryContract
  extends RepositoryContract<UserSettingsModel> {}
