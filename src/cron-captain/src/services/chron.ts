/**
 * Service responsible for handling cron jobs related to Docubox.
 */
import {
  GMAIL_JOBS,
  VAULT_SERVICE_PATH_IDENTIFIER,
  getVaultPath,
} from '@libs/common';
import { Dispatch } from '@libs/nestjs-queue';

import { VaultService } from '@libs/vault';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExternalAccountLibService, UserLibService } from '@src/libs/user/src';
import { Auth, google } from 'googleapis';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private oauth2Client: Auth.OAuth2Client;

  constructor(
    private readonly vaultService: VaultService,
    private config: ConfigService,
    private userLibService: UserLibService,
    private externalAccountLibService: ExternalAccountLibService,
  ) {
    this.initializeGmailAPI();
  }

  /**
   * Cron job that reads and processes Docubox emails.
   */
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async readAndProcessDocuboxEmails() {
    this.logger.log('Fetching emails');

    // get list All of the external_accounts
    const externalAccounts =
      await this.externalAccountLibService.externalAccountRepository.all();

    for (const account of externalAccounts) {
      // check if the account is enabled
      await account.$fetchGraph({ user: true });
      console.log(
        `🚀 - CronService - readAndProcessDocuboxEmails - account:`,
        account,
      );
      // Dispatch({
      //   job: GMAIL_JOBS.FETCH_EMAILS,
      //   data: account,
      // });
    }

    // await this.getRecentEmails();
  }

  /**
   * Initializes the Gmail API by setting up the OAuth2 client.
   */
  private async initializeGmailAPI() {
    this.oauth2Client = new google.auth.OAuth2(
      this.config.get('google.client_id'),
      this.config.get('google.client_secret'),
      this.config.get('google.redirect_uris'),
    );
  }

  /**
   * Retrieves the recent emails from the user's Gmail account and processes them.
   */
  private async getRecentEmails() {
    // initialize the OAuth2 client here to prevent the restart of the app when the app is authorized
    // Read the token from the vault
    const token = await this.vaultService.readSecret<Auth.Credentials>(
      getVaultPath(VAULT_SERVICE_PATH_IDENTIFIER.UTILITY_GMAIL, 'oauth2Token'),
    );
    // If the token is not found, log an error and return
    if (!token) {
      this.logger.error('No token found in vault. Please authorize the app');
      return;
    }
    // Set the credentials for the OAuth2 client
    this.oauth2Client.setCredentials(token);
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'has:attachment is:unread',
    });

    const messageIds = response.data.messages || [];
    if (!messageIds.length) {
      this.logger.log('No new emails found');
      return;
    }
    for (const msg of messageIds) {
      // Fetching the full message
      const fullMessage = await gmail.users.messages.get({
        id: msg.id,
        userId: 'me',
        format: 'full',
      });

      // Extracting headers from the message
      const headers = fullMessage.data.payload?.headers;
      const fromHeader = headers?.find(
        (header) => header.name.toLowerCase() === 'from',
      );
      // Extracting the sender email
      const senderInfo = fromHeader
        ? this.extractNameAndEmailFromHeader(fromHeader.value)
        : { email: 'No sender info', name: 'No sender info' };

      // check if the email has attachments
      if (!fullMessage.data.payload?.parts) {
        continue;
      }
      const attachments = fullMessage.data.payload.parts.filter(
        (part) => part.filename,
      );

      for (const attachment of attachments) {
        // check if the attachment is a pdf or image
        // if (!VALID_FILE_TYPES.includes(attachment.mimeType)) {
        //   continue;
        // }
        const attachmentId = attachment.body?.attachmentId;
        if (!attachmentId) {
          continue;
        }
        const attachmentData = await gmail.users.messages.attachments.get({
          id: attachmentId,
          messageId: fullMessage.data.id,
          userId: 'me',
        });
        if (!attachmentData?.data?.data) {
          continue;
        }
        const buff = Buffer.from(attachmentData.data.data, 'base64');
        // Process the attachment and update the attachment to docubox
        // try {
        //   await this.docuboxLibService.verifyTheSenderAndUploadFile(
        //     this.logger,
        //     {
        //       senderInfo,
        //       attachment: buff,
        //       filename: attachment.filename,
        //       mimeType: attachment.mimeType,
        //     },
        //   );
        //   // mark the email as read
        //   await gmail.users.messages.modify({
        //     id: fullMessage.data.id,
        //     userId: 'me',
        //     requestBody: {
        //       removeLabelIds: ['UNREAD'],
        //     },
        //   });
        // } catch (error) {
        //   this.logger.error('Error processing attachment', error);
        // }
      }
    }
  }

  /**
   * Extracts the email from the header.
   * @param header The header from which the email is to be extracted.
   * @returns The email address.
   */
  extractNameAndEmailFromHeader(header: string) {
    // Fix for the case where the name has more than one word
    const name = header.split('<')[0].trim();
    const emailMatch = header.match(/<([^>]*)>/);

    const email = emailMatch && emailMatch[1] ? emailMatch[1] : '';
    return {
      name,
      email,
    };
  }
}
