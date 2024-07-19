import { Request, Response, RestController } from '@libs/core';
import { Controller, Get, Req, Res } from '@nestjs/common';

import { UserDetailTransformer } from '@src/transformer';
import { Dto, Validate } from '@libs/core/validator';

import { Oauth2CallbackDto, OauthUrlDto, Post, ROLES } from '@libs/common';

import {
  ExternalAccountLibService,
  GetUserByIdOrEmailDto,
  UserLibService,
} from '@src/libs/user/src';
import { UserPermissions } from '@libs/common/guards';

@Controller('users')
export class UserController extends RestController {
  constructor(
    private service: UserLibService,
    private extAccService: ExternalAccountLibService,
  ) {
    super();
  }

  @Get('/profile')
  @UserPermissions(...Object.values(ROLES))
  async getProfile(@Req() req: Request, @Res() res: Response) {
    const user = await this.service.getMyProfile(req?.user?.uuid);
    res.success(await this.transform(user, new UserDetailTransformer()));
  }

  /**
   * Endpoint for handling OAuth2 callback.
   * @param req - The request object.
   * @param res - The response object.
   * @param inputs - The inputs for the OAuth2 callback.
   */
  @Post(':provider/oauth2callback')
  @Validate(Oauth2CallbackDto)
  @UserPermissions(...Object.values(ROLES))
  async oauth2callback(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: Oauth2CallbackDto,
  ) {
    res.success(await this.extAccService.getTokenFromCode(inputs.code));
  }

  @Get('external-accounts')
  @UserPermissions(...Object.values(ROLES))
  async getExternalAccounts(@Req() req: Request, @Res() res: Response) {
    const accounts = await this.extAccService.listServiceAccounts();
    res.success(accounts);
  }
  @Get(':provider/auth-url')
  @UserPermissions(...Object.values(ROLES))
  @Validate(OauthUrlDto)
  async getAuthUrl(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: OauthUrlDto,
  ) {
    const authUrl = await this.extAccService.getAuthUrl(inputs);
    res.success({ authUrl });
  }
}
