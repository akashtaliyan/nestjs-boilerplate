import moment from 'moment';
import { IQuickBook } from '../interfaces';

export const convertQuickBooksToken2IQuickBook = (
  token: Record<string, any>,
): IQuickBook => {
  const x_refresh_token_expires_at = moment()
    .add(token.x_refresh_token_expires_in, 'seconds')
    .toDate();

  const expires_at = moment().add(token.expires_in, 'seconds').toDate();
  return {
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    xRefreshTokenExpiresAt: x_refresh_token_expires_at,
    xRefreshTokenExpiresIn: token.x_refresh_token_expires_in,
    expiresAt: expires_at,
    expiresIn: token.expires_in,
    tokenType: token.token_type,
  };
};

export const convertIQuickBook2QuickBooksToken = (quickbook: IQuickBook) => {
  return {
    access_token: quickbook.accessToken,
    refresh_token: quickbook.refreshToken,
    realmId: quickbook.realmId,
    expires_in: quickbook.expiresIn,
    x_refresh_token_expires_in: quickbook.xRefreshTokenExpiresIn,
    token_type: quickbook.tokenType,
  };
};

export const convertToSlug = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};
