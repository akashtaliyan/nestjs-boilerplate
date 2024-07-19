import { Request, Response, RestController } from '@libs/core';
import { Controller, Get, Req, Res } from '@nestjs/common';

import { UserDetailTransformer } from '@src/transformer';

import { Post, ROLES, UuidDto } from '@libs/common';

import { UserPermissions } from '@libs/common/guards';
import { UserAdminApiService } from './service';

import { CreateUpdateAdminUserDto, CreateUserDto } from '@src/libs/user/src';

import { Dto, Validate } from '@libs/core/validator';

@Controller('admin/users')
export class UserAdminController extends RestController {
  constructor(private apiService: UserAdminApiService) {
    super();
  }

  @Get('')
  @UserPermissions(ROLES.SUPER_ADMIN)
  async getAllUsers(@Req() req: Request, @Res() res: Response) {
    const user = await this.apiService.getAllUsers();
    res.success(await this.collection(user, new UserDetailTransformer()));
  }
  @Get('get/:id')
  @UserPermissions(ROLES.SUPER_ADMIN)
  @Validate(UuidDto)
  async getSingleUser(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: UuidDto,
  ) {
    const user = await this.apiService.getSingleUser(inputs);
    res.success(await this.transform(user, new UserDetailTransformer()));
  }

  @Post('create-update')
  @UserPermissions(ROLES.SUPER_ADMIN)
  @Validate(CreateUpdateAdminUserDto)
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: CreateUpdateAdminUserDto,
  ) {
    const user = await this.apiService.createUpdateUser(inputs);
    res.success(await this.transform(user, new UserDetailTransformer()));
  }
}
