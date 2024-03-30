import { RepositoryContract } from '@libs/nestjs-objection';
import { UserModel } from '@src/user/models';

export interface UserRepositoryContract extends RepositoryContract<UserModel> {}
