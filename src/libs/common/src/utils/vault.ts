import { VAULT_SERVICE_PATH_IDENTIFIER } from '../constants';

export const getVaultPath = (
  serviceIdentifier: VAULT_SERVICE_PATH_IDENTIFIER,
  path: string,
) => {
  return `integrations/${serviceIdentifier}/${path}`;
};
