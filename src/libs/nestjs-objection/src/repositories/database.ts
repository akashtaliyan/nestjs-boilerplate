import { Knex as KnexType } from 'knex';
import { Expression, PrimitiveValue, Transaction } from 'objection';
import { BaseModel } from '../baseModel';
import { ModelNotFound } from '../exceptions';
import { ModelKeys } from '../interfaces';
import { CustomQueryBuilder } from '../queryBuilder';
import { ObjectionService } from '../service';
import { RepositoryContract } from './contract';
import { ClsServiceManager } from 'nestjs-cls';
import { IRequestContext, RequestContext } from '@libs/core';
import { startCase } from 'lodash';

export class DatabaseRepository<T extends BaseModel>
  implements RepositoryContract<T>
{
  model: any;
  knexConnection: KnexType | null = null;

  public bindCon(conName?: string): DatabaseRepository<T> {
    const newRepository = new (<any>(
      this.constructor
    ))() as DatabaseRepository<T>;

    const connection = ObjectionService.connection(
      conName || this.model.connection,
    );
    newRepository.knexConnection = connection;

    return newRepository;
  }

  setModel(model: BaseModel): this {
    this.model = model;
    return this;
  }

  transaction(forceNewTrx?: boolean): Promise<Transaction> | Transaction {
    const cls = ClsServiceManager.getClsService<IRequestContext>();
    const usingRequestTrx = cls.get('usingRequestTrx');
    if (usingRequestTrx && this.requestTrx && !forceNewTrx) {
      return this.requestTrx;
    }

    return this.model.transaction() as Promise<Transaction>;
  }

  /**
   * Get all rows
   */
  async all(): Promise<T[]> {
    return this.query() as unknown as Promise<T[]>;
  }

  /**
   * Get first instance with the matching criterias
   * @param inputs
   * @param error
   */
  async firstWhere(
    inputs: ModelKeys<T>,
    error = true,
    trx?: Transaction,
  ): Promise<T | undefined> {
    trx = !this.usingRequestTrx ? trx : this.requestTrx;

    // inputs = inputs || {};
    const query = this.query<T>(trx);

    const model = await query.findOne(inputs);
    if (error && !model) this.raiseError();

    return model;
  }

  /**
   * Get all instances with the matching criterias
   * @param inputs
   * @param error
   */
  async getWhere(
    inputs: ModelKeys<T>,
    error = true,
    trx?: Transaction,
  ): Promise<T[]> {
    trx = !this.usingRequestTrx ? trx : this.requestTrx;

    const query = this.query<T[]>(trx);

    for (const key in inputs) {
      Array.isArray(inputs[key] as unknown as any)
        ? query.whereIn(
            key,
            inputs[key] as unknown as Expression<PrimitiveValue>[],
          )
        : query.where(key, inputs[key] as unknown as string);
    }
    const models = await query;
    if (error && models.length == 0) this.raiseError();

    return models;
  }

  /**
   * Create a new model with given inputs
   * @param inputs
   */
  async create(inputs: ModelKeys<T>, trx?: Transaction): Promise<T> {
    trx = !this.usingRequestTrx ? trx : this.requestTrx;

    let q;
    try {
      q = await (this.model
        .query(trx)
        .insert(inputs)
        .returning('*') as unknown as T);
    } catch (e) {
      if (e?.constraint?.includes('_pkey')) {
        await this.knexConnection.raw(`SELECT setval (
          (SELECT PG_GET_SERIAL_SEQUENCE('${this.model.tableName}', 'id')),
          (SELECT (MAX("id") + 1) FROM ${this.model.tableName}),true);`);
        q = await (this.query().insert(inputs).returning('*') as unknown as T);
      } else {
        throw e;
      }
    }
    return q;
  }

  /**
   * Update or Create model with given condition and values
   * @param conditions
   * @param values
   */
  async createOrUpdate(
    conditions: ModelKeys<T>,
    values: ModelKeys<T>,
    trx?: Transaction,
  ): Promise<T | undefined> {
    trx = !this.usingRequestTrx ? trx : this.requestTrx;

    const model = await this.firstWhere(conditions, false, trx);
    if (!model) {
      return this.create({ ...conditions, ...values }, trx);
    }

    await this.update(model, values, trx);
    return await this.firstWhere(conditions, false, trx);
  }

  /**
   * First or Create model with given condition and values
   *
   * @param conditions
   * @param values
   */
  async firstOrNew(conditions: ModelKeys<T>, values: ModelKeys<T>): Promise<T> {
    const model = await this.firstWhere(conditions, false);
    if (model) return model;
    return await this.create({ ...conditions, ...values });
  }

  /**
   * Update the given model with values
   * @param model
   * @param setValues
   */
  async update(
    model: ModelKeys<T> | T,
    setValues: ModelKeys<T>,
    trx?: Transaction,
  ): Promise<number | null> {
    trx = !this.usingRequestTrx ? trx : this.requestTrx;

    const query = this.query<number>(trx);
    if (model.id) query.findById(model.id);
    else query.where(model).first();
    query.patch(setValues);
    return await query;
  }

  /**
   * Update all models where condition is matched
   * @param where
   * @param setValues
   */
  async updateWhere(
    where: ModelKeys<T>,
    setValues: ModelKeys<T>,
    trx?: Transaction,
  ): Promise<number | null> {
    trx = !this.usingRequestTrx ? trx : this.requestTrx;

    const query = this.query<number>(trx);
    query.where(where).patch(setValues);
    return query;
  }

  /**
   * Check if any model exists where condition is matched
   * @param params
   */
  async exists(params: T): Promise<boolean> {
    const query = this.query();
    query.where(params);
    return !!(await query.onlyCount());
  }

  /**
   * Get count of rows matching a criteria
   * @param params
   */
  async count(params: T): Promise<number> {
    const query = this.query();
    query.where(params);
    return await query.onlyCount();
  }

  /**
   * Delete a model
   *
   * @param model
   */
  async delete(model: T | number, trx?: Transaction): Promise<boolean> {
    trx = !this.usingRequestTrx ? trx : this.requestTrx;

    return !!+(await this.query(trx).deleteById(
      typeof model != 'object' ? model : model.id,
    ));
  }

  /**
   * Delete documents where query is matched.
   *
   * @param inputs T
   */
  async deleteWhere(inputs: ModelKeys<T>, trx?: Transaction): Promise<boolean> {
    trx = !this.usingRequestTrx ? trx : this.requestTrx;
    const query = this.query(trx);

    for (const key in inputs) {
      Array.isArray(inputs[key])
        ? query.whereIn(key, inputs[key] as unknown as any[])
        : query.where(key, inputs[key] as unknown as any);
    }
    return !!+(await query.delete());
  }

  /**
   * Refresh a model
   *
   * @param model
   */
  async refresh(model: T): Promise<T | undefined> {
    return model ? await this.query().findById(model.id) : undefined;
  }

  /**
   * Relate ids to a model
   * @param model
   * @param relation
   * @param payload
   */
  async attach(
    model: T,
    relation: string,
    payload: number | string | Array<number | string> | Record<string, any>,
    trx?: Transaction,
  ): Promise<void> {
    trx = !this.usingRequestTrx ? trx : this.requestTrx;

    await model.$relatedQuery(relation, trx).relate(payload);
    return;
  }

  /**
   * Sync relation with a model
   * @param model
   * @param relation
   * @param payload
   */
  async sync(
    model: T,
    relation: string,
    payload: any[],
    trx?: Transaction,
  ): Promise<void> {
    trx = !this.usingRequestTrx ? trx : this.requestTrx;

    await model.$relatedQuery(relation, trx).unrelate();
    if (Array.isArray(payload) && payload.length > 0) {
      await model.$relatedQuery(relation, trx).relate(payload);
    }
    return;
  }

  /**
   * Fetch a chunk and run callback
   */
  async chunk(
    where: T,
    size: number,
    cb: (models: T[]) => void,
  ): Promise<void> {
    const query = this.query();
    query.where(where);
    await query.chunk(cb, size);
    return;
  }

  /**
   * Throws model not found exception.
   *
   * @throws ModelNotFoundException
   */
  raiseError(): void {
    throw new ModelNotFound(
      startCase(this.getEntityName()?.replace('Model', '')),
    );
  }

  /**
   * Returns new Query Builder Instance
   */
  query<R = T>(trx?: Transaction): CustomQueryBuilder<T, R> {
    trx = !this.usingRequestTrx ? trx : this.requestTrx;
    if (!this.knexConnection) {
      this.knexConnection = ObjectionService.connection(this.model.connection);
    }
    return trx ? this.model.query(trx) : this.model.query(this.knexConnection);
  }

  getEntityName(): string {
    return this.model.name;
  }

  /**
   * Update rows where condition is matched and return modified rows
   * @param where
   * @param setValues
   * @param returnOne Set this true when you want only the first object to be returned
   */
  async updateAndReturn(
    where: ModelKeys<T>,
    setValues: ModelKeys<T>,
    trx?: Transaction,
  ): Promise<T | T[]> {
    trx = !this.usingRequestTrx ? trx : this.requestTrx;

    const query = this.query(trx);
    const records = await query.where(where).patch(setValues).returning('*');
    if (records.length == 1) return records[0];
    return records;
  }

  /**
   * Bulk insert new models with given inputs,
   * currently only works in mysql.
   * @param inputs
   */
  async bulkInsert(inputs: ModelKeys<T>[], trx?: Transaction): Promise<T[]> {
    trx = !this.usingRequestTrx ? trx : this.requestTrx;
    return this.query(trx).insert(inputs).returning('*') as unknown as T[];
  }

  get usingRequestTrx(): boolean {
    const cls = ClsServiceManager.getClsService();
    return cls.get<boolean>('usingRequestTrx');
  }

  get requestTrx() {
    const cls = ClsServiceManager.getClsService();
    const trx = cls.get<Transaction>(RequestContext.PG_TRANSACTION);

    return trx;
  }
}
