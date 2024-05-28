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
import { UserLibService } from '@src/libs/user/src';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '.';
import { Request } from '../../../core/src/rest';

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
        // check the user token in the db
        const isValidToken = await this.userService.usersTokensRepo.firstWhere({
          token,
          userId: validToken.sub,
        });
        if (!isValidToken) {
          throw new UnauthorizedException('Invalid token.');
        }
        if (isValidToken.isExpired) {
          throw new TokenExpiredError(
            'Token expired.',
            isValidToken.expiryDate,
          );
        }
        // get user
        const currentUser = await this.userService.usersRepo.firstWhere(
          { uuid: validToken.sub },
          false,
        );
        if (!currentUser) throw new UnauthorizedException('Invalid token.');
        req.currentUser = currentUser;

        // check for the roles on req
        const roles = this.reflector.get<string[]>(
          ROLES_KEY,
          context.getHandler(),
        );
        if (!roles) {
          return true;
        }
        const userRoles = await this.userService.getUserRoles(currentUser.id);
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
    // add token last used as now
    await this.userService.usersTokensRepo.update(
      { token, userId: req.user.uuid },
      { lastUsed: new Date() },
    );
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
    UseGuards(AuthRolesGuard),
  );
};
