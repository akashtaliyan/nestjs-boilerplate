import { Request, Response, RestController } from '@libs/core';
import { Controller, Get, Req, Res } from '@nestjs/common';

import { UserDetailTransformer } from '@src/transformer';
import { Dto, Validate } from '@libs/core/validator';

import { Post, ROLES } from '@libs/common';

import { GetUserByIdOrEmailDto, UserLibService } from '@src/libs/user/src';
import { UserPermissions } from '@libs/common/guards';

@Controller('users')
export class UserController extends RestController {
  constructor(private service: UserLibService) {
    super();
  }

  @Get('/profile')
  @UserPermissions(...Object.values(ROLES))
  async getProfile(@Req() req: Request, @Res() res: Response) {
    const user = await this.service.getMyProfile(req?.user?.uuid);
    res.success(await this.transform(user, new UserDetailTransformer()));
  }
}
