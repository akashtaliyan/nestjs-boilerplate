// roles.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ROLES_KEY } from '.';
import { AuthGuard } from '@nestjs/passport';
import { UserLibService } from '@src/libs/user/src';
import { Observable } from 'rxjs';
import { Request } from '../../../core/src/rest';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UserLibService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.handleRolesAuth(context);
  }

  async handleRolesAuth(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!roles) {
      return true;
    }
    const userRoles = await this.userService.getUserRoles(req.user.uuid);
    // check if user is super admin
    if (userRoles.includes('SUPER_ADMIN')) {
      return true;
    }
    const hasRole = roles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource.',
      );
    }
    return true;
  }
}
