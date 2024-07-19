import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from '@libs/core';
import { ExternalAccountLibService, UserLibService } from './services';
import { GreetUser } from './commands';

import { UserModuleConstants } from './constants';
import {
  RolesRepository,
  UserRepository,
  UserRolesMappingRepository,
  UserSettingsRepository,
  UsersTokensRepository,
} from './repositories';
import { VaultModule } from '@libs/vault';

@Module({
  imports: [VaultModule],
  providers: [
    UserLibService,
    GreetUser,
    RolesRepository,
    UserRepository,
    UserRolesMappingRepository,
    UserSettingsRepository,
    UsersTokensRepository,
    ExternalAccountLibService,
  ],
  exports: [UserLibService, ExternalAccountLibService],
})
export class UserLibModule {}
