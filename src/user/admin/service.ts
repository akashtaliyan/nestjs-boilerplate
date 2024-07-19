import { UuidDto } from '@libs/common';
import { Injectable } from '@nestjs/common';

import {
  CreateUpdateAdminUserDto,
  UserLibService,
  UserModel,
} from '@src/libs/user/src';

@Injectable()
export class UserAdminApiService {
  constructor(private userService: UserLibService) {}

  async getAllUsers(): Promise<Array<UserModel>> {
    const query = this.userService.usersRepo.query();
    query.withGraphFetched({
      roles: true,
    });
    const users = (await query) as any;
    return users;
  }
  async getSingleUser(inputs: UuidDto): Promise<UserModel> {
    const query = await this.userService.usersRepo.firstWhere({
      uuid: inputs.id,
    });
    await query.$fetchGraph({
      roles: true,
    });
    const users = query;
    return users;
  }

  async createUpdateUser(inputs: CreateUpdateAdminUserDto): Promise<UserModel> {
    const user = await this.userService.createUpdateUser(inputs);
    return user;
  }
}
