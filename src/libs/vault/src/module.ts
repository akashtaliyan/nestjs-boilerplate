import { Module } from '@nestjs/common';
import { VaultService } from './service';

@Module({
  providers: [VaultService],
  exports: [VaultService],
})
export class VaultModule {}
