import { CoreModule } from '@libs/core';
import { Module } from '@nestjs/common';
import { UserController } from './controllers';

import { UserLibModule } from '@src/libs/user/src';
import { UserAdminApiService, UserAdminController } from './admin';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserLibModule, ConfigModule],
  controllers: [UserController, UserAdminController],
  providers: [UserAdminApiService],
  exports: [],
})
export class UserModule {}
