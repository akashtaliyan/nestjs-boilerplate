import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserLibModule } from '@src/libs/user/src';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    UserLibModule,
  ],
  providers: [],
  exports: [],
})
export class CommonModule {}
