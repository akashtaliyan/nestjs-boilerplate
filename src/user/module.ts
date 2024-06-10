import { CoreModule } from '@libs/core';
import { Module } from '@nestjs/common';
import { UserController } from './controllers';

import { UserLibModule } from '@src/libs/user/src';
import { UserAdminApiService, UserAdminController } from './admin';

@Module({
  imports: [UserLibModule],
  controllers: [UserController, UserAdminController],
  providers: [UserAdminApiService],
  exports: [],
})
export class UserModule {}
