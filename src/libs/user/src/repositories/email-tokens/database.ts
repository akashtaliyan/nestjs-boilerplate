import { DatabaseRepository, InjectModel } from '@libs/nestjs-objection';
import { Injectable } from '@nestjs/common';
import { EmailTokensModel } from '../../models/emailTokens';
import { EmailTokensRepositoryContract } from './contract';

@Injectable()
export class EmailTokensRepository
  extends DatabaseRepository<EmailTokensModel>
  implements EmailTokensRepositoryContract
{
  @InjectModel(EmailTokensModel)
  model: EmailTokensModel;
}
