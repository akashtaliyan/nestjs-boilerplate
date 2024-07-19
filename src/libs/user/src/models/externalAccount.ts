import { BaseModel } from '@libs/nestjs-objection';
import { VaultService } from '@libs/vault';
import { UserModel } from './user';

/**
 * This class is the representation of the all of the externalAccount in the database.
 */
export class ExternalAccountModel extends BaseModel {
  static tableName = 'external_accounts';

  /**
   * The unique identifier of the record.
   */
  uuid: string;

  /**
   * The user ID of the record.
   */
  userId: number;

  /**
   * The provider of the record.
   */
  provider: string;

  /**
   * The email of the record.
   */
  email: string;

  /**
   * The external ID of the record.
   */
  externalId: string;

  /**
   * The expiration status of the record.
   */
  isExpired: boolean;

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

  // relation to assign user on the external account
  user: UserModel;

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'external_accounts.userId',
          to: 'users.id',
        },
      },
    };
  }
}
