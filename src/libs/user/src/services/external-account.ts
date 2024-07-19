import {
  EXTERNAL_PROVIDERS,
  OauthUrlDto,
  VAULT_SERVICE_PATH_IDENTIFIER,
  getVaultPath,
  getVaultPathForExternalAccount,
} from '@libs/common';
import { VaultService } from '@libs/vault';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';
import { ExternalAccountRepository } from '../repositories';
import { RequestContext } from '@libs/core';

/**
 * Service class to handle APIs related to external integrations.
 */
@Injectable()
export class ExternalAccountLibService {
  private googleOauth2Client: Auth.OAuth2Client;
  constructor(
    private config: ConfigService,
    private vaultService: VaultService,
    public externalAccountRepository: ExternalAccountRepository,
    private _ctx: RequestContext,
  ) {
    this.initializeOAuthClient();
  }

  /**
   * Initializes the OAuth2 client for Gmail authentication.
   */
  initializeOAuthClient() {
    // Initialize the OAuth2 client
    this.googleOauth2Client = new google.auth.OAuth2(
      this.config.get('google.client_id'),
      this.config.get('google.client_secret'),
      this.config.get('google.redirect_uris'),
    );
  }

  /**
   * Generates the authorization URL for Gmail authentication.
   * @returns The authorization URL.
   */
  generateAuthUrl(): string {
    const scopes = ['https://www.googleapis.com/auth/gmail.modify'];
    return this.googleOauth2Client.generateAuthUrl({
      access_type: 'offline', // Necessary for refresh token
      scope: scopes,
    });
  }

  /**
   * Retrieves the access token from the authorization code.
   * @param code The authorization code.
   * @returns A success message if the token is saved successfully.
   * @throws UnprocessableEntityException if the email is invalid.
   */
  async getTokenFromCode(code: string) {
    const { tokens } = await this.googleOauth2Client.getToken(code);

    // Make sure that the user logging in email is ACCACIA_BILL_READER_EMAIL
    this.googleOauth2Client.setCredentials(tokens);
    const gmail = google.gmail({
      version: 'v1',
      auth: this.googleOauth2Client,
    });
    // Get user info
    const userInfo = await gmail.users.getProfile({
      userId: 'me',
    });
    // check if refresh token is present
    if (!tokens.refresh_token) {
      throw new UnprocessableEntityException(
        'Refresh token not found. Please authorize the app again. Contact Developers if the issue persists.',
      );
    }

    // Save token to vault
    const user = this._ctx.user;
    // check if the user already has this account linked
    const existingAccount = await this.externalAccountRepository.getWhere(
      {
        userId: user.id,
        provider: EXTERNAL_PROVIDERS.GOOGLE,
        email: userInfo.data.emailAddress,
      },
      false,
    );
    if (existingAccount.length > 0) {
      throw new UnprocessableEntityException('This Account already linked.');
    }
    const trx = await this.externalAccountRepository.transaction();
    try {
      // create entry in external account table
      const account = await this.externalAccountRepository.create(
        {
          userId: user.id,
          provider: EXTERNAL_PROVIDERS.GOOGLE,
          email: userInfo.data.emailAddress,
          isExpired: false,
          externalId: userInfo.data.emailAddress,
          meta: { externalUser: userInfo },
        },
        trx,
      );
      await this.vaultService.writeSecret(
        getVaultPathForExternalAccount(user.uuid, userInfo.data.emailAddress),
        tokens,
      );
      await trx.commit();
      return 'Token saved successfully';
    } catch (error) {
      console.error('Error saving token to vault', error);
      await trx.rollback();
      throw new UnprocessableEntityException(
        'Error saving token. Please try again.',
      );
    }
  }

  /**
   * Lists the service accounts.
   * @returns An array of service accounts.
   */
  async listServiceAccounts() {
    const user = this._ctx.user;
    console.log(user);
    const accounts = await this.externalAccountRepository.getWhere(
      {
        userId: user.id,
      },
      false,
    );
    return accounts;
  }

  async getAuthUrl(inputs: OauthUrlDto) {
    switch (inputs.provider) {
      case EXTERNAL_PROVIDERS.GOOGLE:
        return this.generateAuthUrl();
      default:
        return '';
    }
  }
}
