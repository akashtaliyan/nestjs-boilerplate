import { VAULT_SERVICE_PATH_IDENTIFIER } from '../constants';

export const getVaultPath = (
  serviceIdentifier: VAULT_SERVICE_PATH_IDENTIFIER,
  path: string,
) => {
  return `integrations/${serviceIdentifier}/${path}`;
};

export const getVaultPathForExternalAccount = (
  userId: string,
  email: string,
) => {
  return getVaultPath(
    VAULT_SERVICE_PATH_IDENTIFIER.UTILITY_GMAIL,
    `oauth2Token-${userId}-${email}`,
  );
};
