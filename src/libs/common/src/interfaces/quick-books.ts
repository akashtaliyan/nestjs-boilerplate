import { IUser } from './user';

export interface IQuickBook {
  id?: number;
  uuid?: string;

  userId?: number;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  realmId?: string;
  assetId?: string;
  xRefreshTokenExpiresAt?: Date;
  expiresAt?: Date;
  expiresIn?: number;
  xRefreshTokenExpiresIn?: number;

  user?: IUser;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuickBookVaultStorage {
  accessToken?: string;
  refreshToken?: string;
}
