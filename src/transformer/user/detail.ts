import { User$Model } from '@libs/common';
import { Transformer } from '@libs/core';
import { UserModel } from '@src/libs/user/src';

export class UserDetailTransformer extends Transformer {
  async transform(user: UserModel): Promise<Record<string, any>> {
    return {
      id: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      imageUrl: user.imageUrl,
      isDeleted: user.isDeleted,
      roles: user.roles ? user.roles.map((item) => item.name) : [],
    };
  }
}
