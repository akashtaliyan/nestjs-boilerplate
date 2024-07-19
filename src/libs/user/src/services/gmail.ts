import { getVaultPathForExternalAccount } from '@libs/common';
import { RequestContext } from '@libs/core';
import { VaultService } from '@libs/vault';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';
import { EmailTokensModel, ExternalAccountModel } from '../models';
import {
  EmailTokensRepository,
  ExternalAccountRepository,
} from '../repositories';
import moment from 'moment';

/**
 * Service class to handle APIs related to external integrations.
 */
@Injectable()
export class GmailLibService {
  private googleOauth2Client: Auth.OAuth2Client;
  constructor(
    private config: ConfigService,
    private vaultService: VaultService,
    public externalAccountRepository: ExternalAccountRepository,
    public emailTokensRepository: EmailTokensRepository,
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
  // read email from gmail
  async fetchEmails(account: ExternalAccountModel, beforeToday = false) {
    // read tokens from vault
    const vaultPath = getVaultPathForExternalAccount(
      account.user.uuid,
      account.email,
    );
    const tokens = await this.vaultService.readSecret(vaultPath);
    if (!tokens) {
      console.log('No tokens found');
      return;
    }
    this.googleOauth2Client.setCredentials(tokens);
    const gmail = google.gmail({
      version: 'v1',
      auth: this.googleOauth2Client,
    });
    let nextPageToken = '';
    let count = 0;
    while (true) {
      console.log(`🚀 - Reading Page: ${count++}`);
      const messages = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 500,

        q: beforeToday
          ? `before:${moment().format('YYYY/MM/DD')}`
          : 'is:unread',
        ...(nextPageToken && { pageToken: nextPageToken }),
      });
      if (!messages.data.nextPageToken) {
        break;
      }
      nextPageToken = messages.data.nextPageToken;
      // save the batch to the database
      const trx = await this.emailTokensRepository.transaction();
      try {
        const emailTokens: Partial<EmailTokensModel>[] = [];
        for (const msg of messages.data.messages) {
          emailTokens.push({
            userId: account.user.id,
            accountEmail: account.email,
            accountId: account.id,
            emailRecordId: msg.id,
            threadId: msg.threadId,
            meta: msg,
          });
        }
        await this.emailTokensRepository.bulkInsert(emailTokens, trx);
        await trx.commit();
      } catch (error) {
        await trx.rollback();
        console.error(`🚀 - GmailLibService - readEmails - Error`);
      }
    }
  }
}
