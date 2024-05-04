import {
  Controller,
  Delete,
  NotFoundException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response, RestController, UseTransaction } from '@libs/core';
import { AuthenticationService } from './service'; // Assuming you have an AuthenticationService
import { LoginWithEmailDto, SignUpEmailDto } from './validators';
import { Dto, Validate } from '@libs/core/validator';
import { Get, IQuickBook, Patch, PermissionEnum, Post } from '@libs/common';

import { UserDetailTransformer } from '@src/transformer';
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

  // @UseGuards(JwtRefreshGuard)
  // @Post('refresh')
  // async refresh(@Req() req: Request) {
  //   return req.user;
  // }

  @Get('/profile')
  @Validate(GetUserByIdOrEmailDto)
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
