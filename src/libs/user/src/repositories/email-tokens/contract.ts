import { RepositoryContract } from '@libs/nestjs-objection';
import { EmailTokensModel } from '../../models/emailTokens';

export interface EmailTokensRepositoryContract
  extends RepositoryContract<EmailTokensModel> {}
