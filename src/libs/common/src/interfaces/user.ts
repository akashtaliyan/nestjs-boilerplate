import { ObjectionModel } from '@libs/nestjs-objection';

export interface IUser {
  id?: number;
  uuid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  designation?: string;
  isEmailVerified?: boolean;
  idp?: string;
  isDeleted?: boolean;
  meta?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User$Model extends IUser, ObjectionModel {}

export interface KeycloakUser extends IUser {
  username?: string;
  enabled?: boolean;
  emailVerified?: boolean;
  email?: string;
}

export interface IUserSearch {
  q?: string;
  designation?: string;
  page?: number;
  perPage?: number;
  paginate?: boolean;
  sort?: string;
}

export interface IUserCompany {
  id?: number;
  userId?: number;
  companyId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDomainIdp {
  id?: number;
  uuid?: string;
  domain?: string;
  idp?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
