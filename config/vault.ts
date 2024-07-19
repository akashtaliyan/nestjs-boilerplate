import { registerAs } from '@nestjs/config';
export default registerAs('vault', () => {
  return {
    vaultUrl: process.env.VAULT_URL,
    vaultToken: process.env.VAULT_TOKEN,
  };
});
