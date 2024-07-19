import { GMAIL_JOBS } from '@libs/common';

import { Job } from '@libs/nestjs-queue';
import { Injectable } from '@nestjs/common';

import { Mailman, MailMessage } from '@libs/nest-mailman';
import {
  ExternalAccountLibService,
  ExternalAccountModel,
} from '@src/libs/user/src';
import { GmailLibService } from '@src/libs/user/src/services/gmail';

@Injectable()
export class GmailJobs {
  constructor(
    private externalAccountService: ExternalAccountLibService,
    private gmailService: GmailLibService,
  ) {}
  @Job(GMAIL_JOBS.FETCH_EMAILS)
  async readAllMails(data: ExternalAccountModel) {
    console.log('reading mails');
    await this.gmailService.fetchEmails(data);
  }
}
