import { ConsoleModule } from '@libs/nestjs-console';
import { EventModule } from '@libs/nestjs-events';
import { ObjectionModule } from '@libs/nestjs-objection';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from './user';
import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { MainController } from './controller';
import { AuthenticationModule } from './authentication/module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ObjectionModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('db'),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'JWT_SECRET', // Use env vars for secrets
      signOptions: { expiresIn: '15m' }, // Access token expiry time
      global: true,
    }),
    CoreModule,
    UserModule,
    EventModule,
    ConsoleModule,
    AuthenticationModule,
  ],

  controllers: [MainController],
  providers: [],
})
export class AppModule {}
