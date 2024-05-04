import { Module } from '@nestjs/common';
import { AuthenticationController } from './controller';
import { AuthenticationService } from './service';
import { UserModule } from '@src/user';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshTokenStrategy, JwtStrategy } from './services';
import { UserLibModule } from '@src/libs/user/src';

@Module({
  imports: [UserLibModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
