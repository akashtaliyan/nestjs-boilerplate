// auth-roles.guard.ts

import {
  ExecutionContext,
  Injectable,
  SetMetadata,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request } from '../rest';
import moment from 'moment';

@Injectable()
export class AuthRolesGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  // override the handleRequest method or any other method if you need custom logic
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.handleAuth(context);
  }
  async handleAuth(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(
      'xyz',
      context.getHandler() || context.getClass(),
    );

    console.log(`🚀 - AuthRolesGuard - handleAuth - roles:`, roles);

    const req: Request = context.switchToHttp().getRequest();
    const token = req.headers['authorization'].split(' ').at(1) || '';
    if (!token) return false;
    if (token) {
      try {
        const validToken = await this.jwtService.verifyAsync(token);

        console.log(
          `🚀 - AuthRolesGuard - handleAuth - validToken:`,
          validToken,
          moment.unix(+validToken.exp).toJSON(),
          typeof validToken.exp,
        );

        if (!validToken) return false;
        req.user = validToken;
      } catch (e) {
        console.log(`🚀 - AuthRolesGuard - handleAuth - e:`, e);
        return false;
      }
    }
    return true;
  }
}

export const Restricted = (...roles: string[]) => {
  return applyDecorators(SetMetadata('xyz', roles), UseGuards(AuthRolesGuard));
};
