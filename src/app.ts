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
import { NotificationsModule } from './notifications';
import { CronCaptainModule } from './cron-captain/src/module';
import { QueueModule } from '@libs/nestjs-queue';
import { JobsModule } from '@libs/jobs';
import { GmailJobs } from './Jobs/gmailJobs';
import { UserLibModule } from './libs/user/src';
import { JobManagerApisModule } from './job-manager-apis/src/module';

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
    QueueModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('queue'),
      inject: [ConfigService],
    }),
    CoreModule,
    UserModule,
    EventModule,
    ConsoleModule,
    AuthenticationModule,
    NotificationsModule,
    { global: true, module: JobsModule },
    JobManagerApisModule,
    CronCaptainModule,
    UserLibModule,
  ],

  controllers: [MainController],
  providers: [GmailJobs],
})
export class AppModule {}
