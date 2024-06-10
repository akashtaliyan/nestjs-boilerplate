import { Request, Response, RestController } from '@libs/core';
import { Controller, Get, Req, Res } from '@nestjs/common';

import { UserDetailTransformer } from '@src/transformer';

import { ROLES } from '@libs/common';

import { UserPermissions } from '@libs/common/guards';
import { UserAdminApiService } from './service';

@Controller('admin/users')
export class UserAdminController extends RestController {
  constructor(private apiService: UserAdminApiService) {
    super();
  }

  @Get('')
  @UserPermissions(...Object.values(ROLES))
  async getAllUsers(@Req() req: Request, @Res() res: Response) {
    const user = await this.apiService.getAllUsers();
    res.success(await this.collection(user, new UserDetailTransformer()));
  }
}
