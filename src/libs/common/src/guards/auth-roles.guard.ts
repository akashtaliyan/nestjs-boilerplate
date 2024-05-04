import {
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request } from '../../../core/src/rest';
import { UserLibService } from '@src/libs/user/src';
import { RolesGuard } from './roles.guards';
import { ROLES_KEY } from '.';

@Injectable()
export class AuthRolesGuard extends AuthGuard('jwt') {
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
    return this.handleAuth(context);
  }

  async handleAuth(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    const token = req.headers['authorization']?.split(' ').at(1) || '';

    if (!token) throw new UnauthorizedException('Token is missing.');
    if (token) {
      try {
        const validToken = await this.jwtService.verifyAsync(token);
        if (!validToken) {
          throw new Error('Invalid token.');
        }
        req.user = validToken;
        req.user.uuid = validToken.sub;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new UnauthorizedException('Token expired. please login again.');
        }
        if (error instanceof JsonWebTokenError) {
          throw new UnauthorizedException('Invalid token');
        }
        // Handle other errors if needed
        throw error;
      }
    }
    return true;
  }
}

/**
 *
 * @param roles "USER" | "ADMIN" | "SUPER_ADMIN"
 * @returns
 */
export const UserPermissions = (...roles: string[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AuthRolesGuard, RolesGuard),
  );
};
