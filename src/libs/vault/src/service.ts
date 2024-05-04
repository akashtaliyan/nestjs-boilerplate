import { GenericException } from '@libs/core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Vault from 'node-vault';

@Injectable()
export class VaultService {
  private vaultClient: Vault.client;

  constructor(private configService: ConfigService) {
    const vaultHost = this.configService.get<string>('vault.vaultUrl');
    const vaultToken = this.configService.get<string>('vault.vaultToken');

    const options = {
      apiVersion: 'v1',
      endpoint: vaultHost,
      token: vaultToken,
    };

    this.vaultClient = Vault(options);
  }

  async readSecret<T>(path: string): Promise<T | null> {
    try {
      const response: T = (await this.vaultClient.read(path)).data;

      return response;
    } catch (error) {
      console.error(`Error reading secret from Vault: ${error.message}`);
    }
    // Return null if no data is found
    return null;
  }

  async writeSecret<T>(path: string, data: T): Promise<void> {
    try {
      await this.vaultClient.write(`${path}`, data);
    } catch (error) {
      throw new Error(`Error writing secret to Vault: ${error.message}`);
    }
  }

  async deleteSecret(path: string): Promise<void> {
    try {
      await this.vaultClient.delete(path);
    } catch (error) {
      throw new Error(`Error deleting secret from Vault: ${error.message}`);
    }
  }
}
