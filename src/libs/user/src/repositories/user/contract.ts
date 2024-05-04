import { RepositoryContract } from '@libs/nestjs-objection';
import { UserModel } from '../../models';

export interface UserRepositoryContract extends RepositoryContract<UserModel> {}
