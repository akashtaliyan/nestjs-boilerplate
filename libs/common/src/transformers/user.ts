import { Transformer } from '@libs/core';
import { IUser } from '@libs/common';

export class UserTransformer extends Transformer {
  async transform(user: IUser): Promise<Record<string, any>> {
    return {
      id: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      designation: user.designation,
      createdAt: user.createdAt,
      isDeleted: user.isDeleted,
      idp: user.idp,
    };
  }
}
