import { Queue } from '@libs/nestjs-queue';
import {
  ArgumentsHost,
  Catch,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AxiosError } from 'axios';
import { ClsServiceManager } from 'nestjs-cls';
import { GenericException, InvalidCredentials, ValidationFailed } from '.';
import { CombinedTransaction, RequestContext } from '../reqContext';
import { Request } from '../rest';
import { AppConfig } from '../utils/appConfig';
import { extractRequestPayload } from '../utils/helper';
import { Unauthorized } from './unauthorized';
import { IRequestContext } from '../interfaces';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  doNotReport(): Array<any> {
    return [
      NotFoundException,
      ValidationFailed,
      InvalidCredentials,
      GenericException,
      Unauthorized,
      UnauthorizedException,
    ];
  }

  async catch(exception: any, host: ArgumentsHost) {
    console.error('ERRRR ==> ', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();
    const request = ctx.getRequest<Request>();

    // Get the cls service
    const cls = ClsServiceManager.getClsService<IRequestContext>();
    const trx = cls.get<CombinedTransaction>(RequestContext.TRANSACTION);
    const shouldUseTransaction = cls.get('usingRequestTrx');

    if (shouldUseTransaction && trx && trx.isOpen) {
      try {
        await trx.rollback();
      } catch (e) {
        console.error('ERRRR while rolling back ==> ', e);
      }
    }
    // audit trails
    // Queue.dispatch({
    //   job: 'track_api_events',
    //   data: {
    //     event: AppConfig.get('settings.auditTrail.events.common.exception'),
    //     previous: {},
    //     entityType: AppConfig.get('settings.auditTrail.entityTypes.common'),
    //     entityId: null,
    //     moduleType: AppConfig.get('app.name'),
    //     environment: AppConfig.get('app.env'),
    //     request: extractRequestPayload(request),
    //     error_message: exception?.message,
    //     updated: {},
    //     errors:
    //       exception.errors ??
    //       exception?.response?.data ??
    //       exception.data ??
    //       exception,
    //   },
    // });

    if (exception instanceof ValidationFailed) {
      return response.error(
        {
          message: exception.message,
          errors: exception.getErrors(),
        },
        exception.getStatus(),
      );
    }

    let message =
      exception.message || 'Something went wrong. Please try again later';

    let status = exception.status ? exception.status : 500;
    message = exception.status ? message : 'Internal Server Error';
    if (exception instanceof AxiosError || exception.isAxiosError) {
      message = exception?.response?.data?.message || message;
      status = exception?.status || exception?.response?.status || 500;
    }

    return response.status(status).json({
      success: false,
      code: status,
      message,
    });
  }
}
