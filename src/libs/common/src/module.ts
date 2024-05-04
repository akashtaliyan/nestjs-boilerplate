import { Module } from '@nestjs/common';
import { UserLibModule } from '@src/libs/user/src';

@Module({
  imports: [UserLibModule],
  providers: [],
  exports: [],
})
export class CommonModule {}
