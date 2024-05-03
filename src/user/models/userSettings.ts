import { BaseModel } from '@libs/nestjs-objection';

/**
 * This class is the representation of the all of the userSettings in the database.
 * 
 * table.string('currency').defaultTo('rupees').notNullable();
    table.string('currency_symbol').defaultTo('₹').notNullable();
    table.string('language').defaultTo('en').notNullable();
 */
export class UserSettingsModel extends BaseModel {
  static tableName = 'users_settings';

  /**
   * The unique identifier of the record.
   */
  uuid: string;

  /**
   * The unique identifier of the user that owns the userSettings.
   */
  userId: string;

  /**
   * The currency of the user.
   */
  currency: string;

  /**
   * The currency symbol of the user.
   */
  currencySymbol: string;

  /**
   * The language of the user.
   */
  language: string;

  /**
   * The date and time the record was created.
   */
  createdAt: Date;

  /**
   * The date and time the record was last updated.
   */
  updatedAt: Date;
}
