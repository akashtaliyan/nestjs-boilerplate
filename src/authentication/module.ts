import { Module } from '@nestjs/common';
import { AuthenticationController } from './controller';
import { AuthenticationService } from './service';
import { UserModule } from '@src/user';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshTokenStrategy, JwtStrategy } from './services';
import { UserLibModule } from '@src/libs/user/src';
import { RolesManageService, RolesManagementController } from './admin';
import { AuthConsoleCommand } from './console';

@Module({
  imports: [UserLibModule],
  controllers: [AuthenticationController, RolesManagementController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    RolesManageService,
    AuthConsoleCommand,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
