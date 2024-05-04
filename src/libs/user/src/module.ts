import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from '@libs/core';
import { UserLibService } from './services';
import { GreetUser } from './commands';

import { UserModuleConstants } from './constants';
import {
  RolesRepository,
  UserRepository,
  UserRolesMappingRepository,
  UserSettingsRepository,
} from './repositories';

@Module({
  providers: [
    UserLibService,
    GreetUser,
    RolesRepository,
    UserRepository,
    UserRolesMappingRepository,
    UserSettingsRepository,
  ],
  exports: [UserLibService],
})
export class UserLibModule {}
