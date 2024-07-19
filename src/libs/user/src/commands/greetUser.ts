import { Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '@libs/nestjs-console';
import { ExternalAccountLibService } from '../services';

import { GMAIL_JOBS } from '@libs/common';
import { Dispatch } from '@libs/nestjs-queue';
import { GmailLibService } from '../services/gmail';

@Injectable()
export class GreetUser {
  constructor(
    public externalAccountLibService: ExternalAccountLibService,
    private gmailService: GmailLibService,
  ) {}
  @Command('TriggerReadEmail', {
    desc: 'Trigger read email job',
  })
  public async TriggerEmail(_cli: ConsoleIO): Promise<void> {
    console.log('Triggering email job');
    // get list All of the external_accounts
    const externalAccounts =
      await this.externalAccountLibService.externalAccountRepository.all();

    for (const account of externalAccounts) {
      // check if the account is enabled
      await account.$fetchGraph({ user: true });

      await this.gmailService.fetchEmails(account, true);
      break;
    }
  }
}
