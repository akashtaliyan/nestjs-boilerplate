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
export class RefreshTokenGuard extends AuthGuard('jwt') {
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
    const refreshToken = `${req.headers['refresh-token']}` || '';

    if (!refreshToken)
      throw new UnauthorizedException('refreshToken is missing.');
    if (refreshToken) {
      try {
        const validRefreshToken = await this.jwtService.verifyAsync(
          refreshToken,
          {
            secret: process.env.REFRESH_TOKEN_SECRET || 'JWT_REFRESH_SECRET',
          },
        );

        if (!validRefreshToken) {
          throw new Error('Invalid token.');
        }
        req.user = validRefreshToken;
        req.user.uuid = validRefreshToken.sub;
        // get user
        const currentUser = await this.userService.usersRepo.firstWhere(
          { uuid: validRefreshToken.sub },
          false,
        );
        if (!currentUser) throw new UnauthorizedException('Invalid token.');
        req.currentUser = currentUser;
        // delete the current token
        await this.userService.usersTokensRepo.updateWhere(
          {
            token,
            userId: validRefreshToken.sub,
          },
          {
            isExpired: true,
          },
        );
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
export const RefreshTokenPermissions = () => {
  return applyDecorators(UseGuards(RefreshTokenGuard));
};
