import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { get, omit } from 'lodash';
import { Observable } from 'rxjs';
import { Request, Response } from './interfaces';
import { ClsServiceManager } from 'nestjs-cls';
import { CombinedTransaction } from '../reqContext';
import { USE_TRANSACTION_METADATA_KEY } from '../interceptors';
import { IRequestContext } from '../interfaces';
import { AppConfig } from '../utils/appConfig';

@Injectable()
export class RequestGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.bindRequestHelpers(context.switchToHttp().getRequest());
    this.bindResponseHelpers(context.switchToHttp().getResponse());
    this.initTransaction(context);

    return true;
  }

  /**
   * Bind Response Helpers
   *
   * @param response
   */
  bindResponseHelpers(response: Response): any {
    const success = function (
      data: Record<string, any> | Array<any> | string | boolean | number,
      status = 200,
    ) {
      return response.status(status).send({
        success: true,
        code: status,
        data: data,
      });
    };

    const error = function (error: Record<string, any> | string, status = 401) {
      let message = 'Something went wrong!';
      let errors = null;
      if (error instanceof Object) {
        message = error.message;
        errors = error.errors;
      } else {
        message = error;
      }

      return response.status(status).send({
        success: false,
        code: status,
        message: message,
        errors: errors,
      });
    };

    const noContent = function () {
      return response.status(204).end();
    };

    const withMeta = function (data: Record<string, any>, status = 200) {
      return response.status(status).send({
        success: true,
        code: status,
        data: get(data, 'data'),
        meta: omit(data, ['data']),
      });
    };

    response.success = success;
    response.error = error;
    response.noContent = noContent;
    response.withMeta = withMeta;

    return response;
  }

  /**
   * Bind Request Helpers
   *
   * @param request
   */
  bindRequestHelpers(request: any): any {
    const all = function (): Record<string, any> {
      const inputs = { ...request.query, ...request.body, ...request.params };

      for (const key in inputs) {
        const value = inputs[key];
        if (typeof value === 'string' || value instanceof String) {
          inputs[key] = value.trim();
        }
      }

      return inputs;
    };

    const getContext = function (): Request {
      return {
        user: request.user,
        ...request.query,
        ...request.body,
        ...request.params,
      };
    };

    request.all = all;
    request.getContext = getContext;
    return request;
  }

  /**
   * Initialize the request transaction
   * @param request
   */
  async initTransaction(context: ExecutionContext) {
    const ctx = ClsServiceManager.getClsService<IRequestContext>();
    const inDebug = AppConfig.get('app.debug');
    const shouldUseTransaction =
      Reflect.getMetadata(USE_TRANSACTION_METADATA_KEY, context.getHandler()) ||
      Reflect.getMetadata(USE_TRANSACTION_METADATA_KEY, context.getClass()) ||
      false;

    inDebug &&
      console.log(`useTransaction in request guard:`, shouldUseTransaction);
    ctx.set('usingRequestTrx', shouldUseTransaction);
    // Setup the transaction
    if (shouldUseTransaction) {
      // Setup the transaction
      const store = ctx.get();
      const trx = store.transaction;
      if (!trx) {
        inDebug &&
          console.log('Assigning transactions in Request Guard', ctx.getId());

        await new CombinedTransaction(ctx)._assignTrx(); // Assigns the transaction to the context
      }
    }
  }
}
