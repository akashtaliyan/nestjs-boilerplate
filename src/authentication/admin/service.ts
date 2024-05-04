import {
  Injectable,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { comparePassword, hashPassword } from '@src/libs/common/src';
import { UserModel, UserLibService } from '@src/libs/user/src';
import { LoginWithEmailDto, SignUpEmailDto } from '../validators';
import { AddRoleDto, AssignOrRevokeRoleDto } from './validators/rolesDTOs';

@Injectable()
export class RolesManageService {
  constructor(public userService: UserLibService) {} // UserService handles interaction with the user repository

  async addOrUpdateRole(inputs: AddRoleDto): Promise<any> {
    const { role, id } = inputs;

    // update role if id is provided
    if (id) {
      // check if the role exists
      const roleExists = await this.userService.rolesRepo.firstWhere(
        {
          uuid: id,
        },
        false,
      );
      if (!roleExists) {
        throw new UnprocessableEntityException('Role does not exist.');
      }
      // update role
      await this.userService.rolesRepo.update(
        {
          uuid: id,
        },
        {
          role: role,
        },
      );
      return 'Role updated successfully.';
    }
    // add new role
    // check if the role exists
    const roleExists = await this.userService.rolesRepo.firstWhere(
      {
        role: role,
      },
      false,
    );
    if (roleExists) {
      throw new UnprocessableEntityException('Role already exists.');
    }

    // create new role
    await this.userService.rolesRepo.create({
      role: role,
    });

    return 'Role added successfully.';
  }

  async deleteRole(id: string): Promise<any> {
    // check if the role exists
    const roleExists = await this.userService.rolesRepo.firstWhere(
      {
        uuid: id,
      },
      false,
    );
    if (!roleExists) {
      throw new UnprocessableEntityException('Role does not exist.');
    }

    // create transaction to delete role as well as user roles mapping

    const trx = await this.userService.rolesRepo.transaction();
    try {
      // first delete the user roles mapping
      await this.userService.userRolesRepo.deleteWhere({
        roleId: id,
      });
      // then delete the role
      await this.userService.rolesRepo.deleteWhere({
        uuid: id,
      });
      await trx.commit();
      return 'Role deleted successfully.';
    } catch (error) {
      await trx.rollback();
      throw new UnprocessableEntityException('Error deleting role.');
    }
  }

  async assignRoleToUser(inputs: AssignOrRevokeRoleDto): Promise<any> {
    const { userId, roleId } = inputs;

    // check if the user exists
    const userExists = await this.userService.usersRepo.firstWhere(
      {
        uuid: userId,
      },
      false,
    );
    if (!userExists) {
      throw new UnprocessableEntityException('User does not exist.');
    }

    // check if the role exists
    const roleExists = await this.userService.rolesRepo.firstWhere(
      {
        uuid: roleId,
      },
      false,
    );
    if (!roleExists) {
      throw new UnprocessableEntityException('Role does not exist.');
    }

    // check if the user already has the role
    const userHasRole = await this.userService.userRolesRepo.firstWhere(
      {
        userId: userId,
        roleId: roleId,
      },
      false,
    );
    if (userHasRole) {
      throw new UnprocessableEntityException('User already has the role.');
    }

    // create user role mapping
    await this.userService.userRolesRepo.create({
      userId: userId,
      roleId: roleId,
    });

    return 'Role assigned successfully.';
  }

  async revokeRoleFromUser(inputs: AssignOrRevokeRoleDto): Promise<any> {
    const { userId, roleId } = inputs;

    // check if the user exists
    const userExists = await this.userService.usersRepo.firstWhere(
      {
        uuid: userId,
      },
      false,
    );
    if (!userExists) {
      throw new UnprocessableEntityException('User does not exist.');
    }

    // check if the role exists
    const roleExists = await this.userService.rolesRepo.firstWhere(
      {
        uuid: roleId,
      },
      false,
    );
    if (!roleExists) {
      throw new UnprocessableEntityException('Role does not exist.');
    }

    // check if the user has the role
    const userHasRole = await this.userService.userRolesRepo.firstWhere(
      {
        userId: userId,
        roleId: roleId,
      },
      false,
    );
    if (!userHasRole) {
      throw new UnprocessableEntityException('User does not have the role.');
    }

    // delete user role mapping
    await this.userService.userRolesRepo.deleteWhere({
      userId: userId,
      roleId: roleId,
    });

    return 'Role revoked successfully.';
  }
}
