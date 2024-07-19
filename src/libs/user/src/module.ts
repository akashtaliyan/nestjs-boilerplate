import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from '@libs/core';
import { ExternalAccountLibService, UserLibService } from './services';
import { GreetUser } from './commands';

import { UserModuleConstants } from './constants';
import {
  EmailTokensRepository,
  ExternalAccountRepository,
  RolesRepository,
  UserRepository,
  UserRolesMappingRepository,
  UserSettingsRepository,
  UsersTokensRepository,
} from './repositories';
import { VaultModule } from '@libs/vault';
import { ConfigModule } from '@nestjs/config';
import { GmailLibService } from './services/gmail';

@Module({
  imports: [VaultModule],
  providers: [
    ConfigModule,
    UserLibService,
    GreetUser,
    RolesRepository,
    UserRepository,
    UserRolesMappingRepository,
    UserSettingsRepository,
    UsersTokensRepository,
    ExternalAccountRepository,
    ExternalAccountLibService,
    GmailLibService,
    EmailTokensRepository,
  ],
  exports: [UserLibService, ExternalAccountLibService, GmailLibService],
})
export class UserLibModule {}
