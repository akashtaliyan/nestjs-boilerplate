// roles.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '.';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found.');
    }

    const bearerToken = authHeader.split(' ')[1];
    const decodedToken = this.jwtService.verify(bearerToken, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    });

    return requiredRoles.some((role) => decodedToken.roles?.includes(role));
  }
}
