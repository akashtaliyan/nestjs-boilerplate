import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { RolesModel, UserModel, UserRolesMappingModel } from '../models';
import {
  RolesRepository,
  UserRepository,
  UserRolesMappingRepository,
  UserSettingsRepository,
  UsersTokensRepository,
} from '../repositories';

@Injectable()
export class UserLibService {
  constructor(
    public usersRepo: UserRepository,
    public userRolesRepo: UserRolesMappingRepository,
    public rolesRepo: RolesRepository,
    public userSettingsRepo: UserSettingsRepository,
    public usersTokensRepo: UsersTokensRepository,
  ) {}

  async getMyProfile(id: string): Promise<UserModel> {
    const user = await this.usersRepo.firstWhere({ uuid: id }, false);
    if (!user) {
      throw new UnprocessableEntityException(
        'No user found with the provided email. Please verify the email and try again.',
      );
    }

    await user.$fetchGraph({ roles: true });
    return user;
  }

  async getUserByIdOrEmail({
    id,
    email,
  }: {
    id?: string;
    email?: string;
  }): Promise<UserModel> {
    // Ensure at least one of the parameters is provided
    if (!id && !email) {
      throw new UnprocessableEntityException(
        'Either user ID or email is required for this operation.',
      );
    }

    let user: UserModel | undefined;

    // If an ID is provided, try to fetch the user by ID
    if (id) {
      user = await this.usersRepo.firstWhere({ uuid: id });
      if (user) {
        return user;
      }
      // If no user is found by ID and email is not provided, throw an exception
      if (!email) {
        throw new UnprocessableEntityException(
          'No user found with the provided ID. Please verify the ID and try again.',
        );
      }
    }

    // If an email is provided or no user found by ID, try to fetch the user by email
    if (email) {
      user = await this.usersRepo.firstWhere({ email: email });
      if (!user) {
        throw new UnprocessableEntityException(
          'No user found with the provided email. Please verify the email and try again.',
        );
      }
      return user;
    }

    // This line is theoretically unreachable due to the checks above
    throw new UnprocessableEntityException(
      'Unable to retrieve user information. Please provide a valid ID or email.',
    );
  }

  async getUserRoles(userId: number) {
    const rolesMaps = (await this.userRolesRepo
      .query()
      .where('userId', userId)
      .withGraphFetched({ role: true })) as any as UserRolesMappingModel[];

    const roles = [];
    for (const roleMap of rolesMaps) {
      roles.push(roleMap.role.name);
    }
    return roles;
  }
}
