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
  imports: [
    UserLibModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
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
