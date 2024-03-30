import { Injectable } from '@nestjs/common';
import { CLS_REQ, ClsService, ClsStore, Terminal } from 'nestjs-cls';
import { Request } from './rest';
import { ObjectionService } from '@libs/nestjs-objection';
import { Knex } from 'knex';

import { IRequestContext } from './interfaces';

@Injectable()
export class RequestContext {
  // Setting default keys for the context this needs to match whats in the IRequestContext interface
  static PG_TRANSACTION = 'pgTrx'; // Knex.Transaction
  // static NEO4J_TRANSACTION = 'neo4jTrx'; // Neo4jTransaction
  static TRANSACTION = 'transaction'; // CombinedTransaction

  constructor(public readonly ctx: ClsService<Terminal<IRequestContext>>) {}

  get id() {
    return this.ctx.getId();
  }

  get req() {
    return this.ctx.get<Request>(CLS_REQ);
  }

  get user() {
    return this?.req?.currentUser;
  }

  get store() {
    return this.ctx.get();
  }

  get transaction() {
    return this.ctx.get<CombinedTransaction>(RequestContext.TRANSACTION);
  }

  /**
   * Set (or overrides) a value on the CLS context.
   * @param key the key
   * @param value the value to set
   */
  set(key: string | keyof ClsStore, value: any): void {
    this.ctx.set(key, value);
  }

  /**
   * Get a value from the CLS context by key.
   * @param key the key from which to retrieve the value, returns the whole context if ommited
   * @returns the value stored under the key or undefined
   */
  get<T = any>(key?: string | keyof ClsStore): T {
    return this.ctx.get(key);
  }
}

export class CombinedTransaction {
  public pgTrx: Knex.Transaction;
  // public neo4jTrx: Neo4jTransaction;
  constructor(private readonly ctx: ClsService) {}

  /**
   * Function to assign transactions to the request context. Making it public now we will use outside instead in constructor to avoid some race condition where it was not being ran in cli usage
   */
  public readonly _assignTrx = async () => {
    const existingTrx = this.ctx.get<Knex.Transaction>(
      RequestContext.PG_TRANSACTION,
    );
    if (existingTrx) this.pgTrx = existingTrx;
    else {
      const conn = ObjectionService.connection();
      const pgTrx = await conn.transaction();
      this.ctx.set(RequestContext.PG_TRANSACTION, pgTrx);
      this.pgTrx = pgTrx;
    }

    this.ctx.set(RequestContext.TRANSACTION, this);
  };

  async commit() {
    if (!this.pgTrx) return;
    console.log('Committing transactions', this.ctx.getId());
    if (!this?.pgTrx?.isCompleted()) {
      console.log('COMMIT PG', this.ctx.getId());
      await this.pgTrx.commit();
    }
  }

  async rollback() {
    if (!this.pgTrx) return;

    console.log('Rolling back transactions', this.ctx.getId());
    if (!this?.pgTrx?.isCompleted()) {
      console.log('ROLLBACK PG', this.ctx.getId());
      await this.pgTrx.rollback();
    }
  }

  get isOpen() {
    return !this.pgTrx.isCompleted();
  }
}
