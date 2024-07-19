import { BaseModel } from '@libs/nestjs-objection';
import { VaultService } from '@libs/vault';
import { UserModel } from './user';

/**
 * This class is the representation of the all of the externalAccount in the database.
 */
export class EmailTokensModel extends BaseModel {
  static tableName = 'email_tokens';

  /**
   * The unique identifier of the record.
   */
  uuid: string;

  /**
   * The user ID of the record.
   */
  userId: number;
  // account_email
  // account_id
  // id
  // thread_id
  // is_ready

  /**
   * The email address of the account.
   */
  accountEmail: string;

  /**
   * The account ID of the account.
   */
  accountId: number;

  /**
   * The emailRecord ID of the record.
   */
  emailRecordId: string;

  /**
   * The ID of the thread.
   */
  threadId: string;

  /**
   * The date and time the record was created.
   */
  createdAt: Date;

  /**
   * The date and time the record was last updated.
   */
  updatedAt: Date;

  /**
   * The metadata of the record.
   */
  meta: Record<string, any>;

  // static get relationMappings() {
  //   return {
  //     user: {
  //       relation: BaseModel.BelongsToOneRelation,
  //       modelClass: UserModel,
  //       join: {
  //         from: 'external_accounts.userId',
  //         to: 'users.id',
  //       },
  //     },
  //   };
  // }
}
