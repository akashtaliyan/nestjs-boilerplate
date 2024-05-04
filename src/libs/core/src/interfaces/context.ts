import { CombinedTransaction } from '@libs/core';

import { ClsStore } from 'nestjs-cls';
import { Transaction as PgTransaction } from 'objection';

export interface IRequestContext extends ClsStore {
  id: string;
  transaction: CombinedTransaction;
  pgTrx: PgTransaction;

  usingRequestTrx: boolean;
}
