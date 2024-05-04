import { CoreModule } from '@libs/core';
import { Module } from '@nestjs/common';
import { UserController } from './controllers';

import { UserLibModule } from '@src/libs/user/src';

@Module({
  imports: [UserLibModule],
  controllers: [UserController],
  providers: [],
  exports: [],
})
export class UserModule {}
