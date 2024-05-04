import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from '@libs/core';
import { UserLibService } from './services';
import { GreetUser } from './commands';
import { UserRepository } from './repositories';
import { UserModuleConstants } from './constants';

@Module({
  providers: [
    UserLibService,
    GreetUser,
    { provide: UserModuleConstants.userRepo, useClass: UserRepository },
  ],
  exports: [UserLibService],
})
export class UserLibModule {}
