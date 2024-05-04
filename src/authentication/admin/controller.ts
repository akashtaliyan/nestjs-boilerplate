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
import { RolesManageService } from './service'; // Assuming you have an AuthenticationService

import { Dto, Validate } from '@libs/core/validator';
import { Get, IQuickBook, Patch, PermissionEnum, Post } from '@libs/common';

import { UserDetailTransformer } from '@src/transformer';
import { GetUserByIdOrEmailDto } from '@src/libs/user/src';
import { AddRoleDto, AssignOrRevokeRoleDto, DeleteRoleDto } from './validators';
import { UserPermissions } from '@libs/common/guards';

@Controller('admin')
export class RolesManagementController extends RestController {
  constructor(private readonly roleManageService: RolesManageService) {
    super();
  }

  /**
   * add new role or update existing role
   * @param req
   * @param res
   * @param inputs
   * @returns
   */
  @Post('role/add')
  @UserPermissions('ADMIN')
  @Validate(AddRoleDto)
  async addOrUpdateRole(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: AddRoleDto,
  ) {
    return res.success(await this.roleManageService.addOrUpdateRole(inputs));
  }

  /**
   * assign role to user
   * @param req
   * @param res
   * @param inputs
   * @returns
   */
  @Patch('role/assign')
  @UserPermissions('ADMIN')
  @Validate(AssignOrRevokeRoleDto)
  async assignRoleToUser(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: AssignOrRevokeRoleDto,
  ) {
    return res.success(await this.roleManageService.assignRoleToUser(inputs));
  }
  /**
   * assign role to user
   * @param req
   * @param res
   * @param inputs
   * @returns
   */
  @Patch('role/revoke')
  @UserPermissions('ADMIN')
  @Validate(AssignOrRevokeRoleDto)
  async revokeRoleOfUser(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: AssignOrRevokeRoleDto,
  ) {
    return res.success(await this.roleManageService.revokeRoleFromUser(inputs));
  }

  /**
   * delete role
   * @param req
   * @param res
   * @param inputs
   * @returns
   */
  @Delete('role/delete')
  @UserPermissions('ADMIN')
  @Validate(DeleteRoleDto)
  async deleteRole(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: DeleteRoleDto,
  ) {
    return res.success(await this.roleManageService.deleteRole(inputs.id));
  }
}
