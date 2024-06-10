import { Get, Post, ROLES } from '@libs/common';
import { Request, Response, RestController } from '@libs/core';
import { Dto, Validate } from '@libs/core/validator';
import { Controller, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './service'; // Assuming you have an AuthenticationService
import { LoginWithEmailDto, SignUpEmailDto } from './validators';

import { RefreshTokenPermissions, UserPermissions } from '@libs/common/guards';
import { GetUserByIdOrEmailDto } from '@src/libs/user/src';

@Controller('auth')
export class AuthenticationController extends RestController {
  constructor(private readonly authenticationService: AuthenticationService) {
    super();
  }

  @Post('signup/email')
  @Validate(SignUpEmailDto)
  async signUpWithEmail(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: SignUpEmailDto,
  ) {
    return res.success(
      await this.authenticationService.signUpWithEmail(inputs),
    );
  }

  @Post('login/email')
  @Validate(LoginWithEmailDto)
  async loginWithEmail(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: LoginWithEmailDto,
  ) {
    return res.success(await this.authenticationService.loginWithEmail(inputs));
  }

  @Post('refresh-token')
  @RefreshTokenPermissions()
  async refresh(@Req() req: Request, @Res() res: Response) {
    return res.success(await this.authenticationService.refreshToken());
  }

  @Post('logout')
  @UserPermissions(...Object.values(ROLES))
  async logout(@Req() req: Request, @Res() res: Response) {
    return res.success(await this.authenticationService.logout());
  }

  @Get('/profile')
  @Validate(GetUserByIdOrEmailDto)
  @UserPermissions(...Object.values(ROLES))
  async getProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: GetUserByIdOrEmailDto,
  ): Promise<Response> {
    const user =
      await this.authenticationService.userService.getUserByIdOrEmail(inputs);
    return res.success(user);
  }
  // OAuth routes
  @Get('oauth/google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Initiates the Google OAuth2 login flow
  }

  @Get('oauth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    // Handles the Google OAuth2 callback
    return this.authenticationService.googleLogin(req.user);
  }

  // Similar routes can be set up for Facebook and other providers
}
