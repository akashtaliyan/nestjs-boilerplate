import { Transaction } from 'objection';
import { BaseModel } from '../baseModel';
import { ModelKeys } from '../interfaces';
import { CustomQueryBuilder } from '../queryBuilder';

export interface RepositoryContract<T extends BaseModel> {
  model: any;

  /**
   * Get all rows
   */
  all(inputs?: T): Promise<T[]>;

  /**
   * Get first instance with the matching criterias
   * @param inputs
   * @param error
   */
  firstWhere(
    inputs: ModelKeys<T>,
    error?: boolean,
    trx?: Transaction,
  ): Promise<T | undefined>;

  /**
   * Get all instances with the matching criterias
   * @param inputs
   * @param error
   */
  getWhere(inputs: ModelKeys<T>, error?: boolean): Promise<T[]>;

  /**
   * Create a new model with given inputs
   * @param inputs
   */
  create(inputs: ModelKeys<T>, trx?: Transaction): Promise<T>;

  /**
   * Update or Create model with given condition and values
   * @param conditions
   * @param values
   */
  createOrUpdate(
    conditions: ModelKeys<T>,
    values: ModelKeys<T>,
    trx?: Transaction,
  ): Promise<T | undefined>;

  /**
   * First or Create model with given condition and values
   *
   * @param conditions
   * @param values
   */
  firstOrNew(conditions: ModelKeys<T>, values: ModelKeys<T>): Promise<T>;

  /**
   * Update the given model with values
   * @param model
   * @param setValues
   */
  update(
    model: ModelKeys<T> | T,
    setValues: ModelKeys<T>,
    trx?: Transaction,
  ): Promise<number | null>;

  /**
   * Update all models where condition is matched
   * @param column
   * @param value
   * @param setValues
   */
  updateWhere(
    where: ModelKeys<T>,
    setValues: ModelKeys<T>,
    trx?: Transaction,
  ): Promise<number | null>;

  /**
   * Check if any model exists where condition is matched
   * @param params
   */
  exists(params: T): Promise<boolean>;

  /**
   * Get count of rows matching a criteria
   * @param params
   */
  count(params: T): Promise<number>;

  /**
   * Refresh a model
   *
   * @param model
   */
  refresh(model: T): Promise<T | undefined>;

  /**
   * Delete a model
   *
   * @param model
   */
  delete(model: T, trx?: Transaction): Promise<boolean>;

  /**
   * Delete documents where query is matched.
   *
   * @param params
   */
  deleteWhere(params: ModelKeys<T>, trx?: Transaction): Promise<boolean>;

  /**
   * Relate ids to a model
   * @param model
   * @param relation
   * @param payload
   */
  attach(
    model: T,
    relation: string,
    payload: number | string | Array<number | string> | Record<string, any>,
    trx?: Transaction,
  ): Promise<void>;

  /**
   * Sync relation with a model
   * @param model
   * @param relation
   * @param payload
   */
  sync(
    model: T,
    relation: string,
    payload: any[],
    trx?: Transaction,
  ): Promise<void>;

  /**
   * Fetch a chunk and run callback
   */
  chunk(where: T, size: number, cb: (models: T[]) => void): Promise<void>;

  /**
   * Throws model not found exception.
   *
   * @throws ModelNotFoundException
   */
  raiseError(): void;

  /**
   * Returns new Query Builder Instance
   */
  query(trx?: Transaction): CustomQueryBuilder<T>;

  /**
   * Update rows where condition is matched and return modified rows
   * @param where
   * @param setValues
   * @param returnOne Set this true when you want only the first object to be returned
   */
  updateAndReturn(
    where: ModelKeys<T>,
    setValues: ModelKeys<T>,
    trx?: Transaction,
  ): Promise<T | T[]>;

  /**
   * Bulk insert new models with given inputs
   * @param inputs
   */
  bulkInsert(inputs: ModelKeys<T>[], trx?: Transaction): Promise<T[]>;

  /**
   * Create new transaction.
   */
  transaction(forceNewTrx?: boolean): Transaction | Promise<Transaction>;
}
