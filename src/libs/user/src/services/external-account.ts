import { VAULT_SERVICE_PATH_IDENTIFIER, getVaultPath } from '@libs/common';
import { VaultService } from '@libs/vault';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';

/**
 * Service class to handle APIs related to external integrations.
 */
@Injectable()
export class ExternalAccountLibService {
  private googleOauth2Client: Auth.OAuth2Client;

  constructor(
    private config: ConfigService,
    private vaultService: VaultService,
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
    // Check if the user is authorized
    // if (
    //   userInfo.data.emailAddress !==
    //   this.config.get('google.accaciaBillReaderEmail')
    // ) {
    //   throw new UnprocessableEntityException(
    //     'Invalid email. Please use the correct bill-reader email to authorize.',
    //   );
    // }
    // check if refresh token is present
    if (!tokens.refresh_token) {
      throw new UnprocessableEntityException(
        'Refresh token not found. Please authorize the app again. Contact Developers if the issue persists.',
      );
    }

    // Save token to vault
    try {
      await this.vaultService.writeSecret(
        getVaultPath(
          VAULT_SERVICE_PATH_IDENTIFIER.UTILITY_GMAIL,
          'oauth2Token',
        ),
        tokens,
      );
      return 'Token saved successfully';
    } catch (error) {
      console.error('Error saving token to vault', error);
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
    // For now, we have only Google service account for email reading
    const email = this.config.get('google.accaciaBillReaderEmail');
    //
    const vaultPath = getVaultPath(
      VAULT_SERVICE_PATH_IDENTIFIER.UTILITY_GMAIL,
      'oauth2Token',
    );
    const token = await this.vaultService.readSecret(vaultPath);
    const connectUrl = this.generateAuthUrl();
    const serviceAccounts = [
      {
        provider: 'google',
        accountEmail: email,
        connected: !!token,
        ...(!token && { connectUrl }),
      },
    ];
    return serviceAccounts;
  }
}
