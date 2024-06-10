import { Injectable } from '@nestjs/common';

import { UserLibService, UserModel } from '@src/libs/user/src';

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
}
