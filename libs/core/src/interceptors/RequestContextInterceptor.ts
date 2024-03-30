import { CombinedTransaction, IRequestContext } from '@libs/core';
import {
  CallHandler,
  CustomDecorator,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
  applyDecorators,
} from '@nestjs/common';
import { ClsService, Terminal, UseCls } from 'nestjs-cls';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  constructor(private readonly ctx: ClsService<Terminal<IRequestContext>>) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const shouldUseTransaction = this.ctx.get('usingRequestTrx');

    // Setup the transaction
    let trx: CombinedTransaction | undefined;
    if (shouldUseTransaction) {
      const store = this.ctx.get();
      trx = store.transaction;
      if (!trx) {
        console.log('Assigning transactions in interceptor', this.ctx.getId());

        const newTrx = new CombinedTransaction(this.ctx);
        await newTrx._assignTrx();

        trx = newTrx;
      }
    }

    return next.handle().pipe(
      tap(async () => {
        if (shouldUseTransaction && trx && trx.isOpen) {
          await trx.commit();
        }
      }),
    );
  }
}

/**
 * Adds the request context to a controller function
 */
export function UseTransaction() {
  return applyDecorators(SetMetadata(USE_TRANSACTION_METADATA_KEY, true));
}

export const USE_TRANSACTION_METADATA_KEY = 'useTransaction';

/**
 * Fakes the request context to the job or anything else that is not running inside the nestjs di
 */
export function UseCliTransaction() {
  return applyDecorators(
    UseCls({
      generateId: true,
      async setup(cls, ...args) {
        cls.set('usingRequestTrx', true);
        const trx = new CombinedTransaction(cls);
        await trx._assignTrx();
      },
    }) as CustomDecorator,
  );
}
