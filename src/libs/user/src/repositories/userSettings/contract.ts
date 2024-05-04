import { RepositoryContract } from '@libs/nestjs-objection';
import { UserSettingsModel } from '../../models/userSettings';

export interface UserSettingsRepositoryContract
  extends RepositoryContract<UserSettingsModel> {}
