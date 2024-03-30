import { IUser } from '@libs/common';
import { Request as BaseRequest, Response as BaseResponse } from 'express';
import { Transaction } from 'objection';

export interface Request extends BaseRequest {
  /**
   * Get all inputs from the request object
   */
  all(): Record<string, any>;

  getContext(): Request;

  /**
   * Get the current user from the request object from keycloak
   */
  user: IUser;

  isAdmin: boolean;

  // Get the current user from the request object from database
  currentUser?: IUser;

  // Permission required to access the route
  routePermissions?: string[];

  canAccess?: (resource: string, resourceId: string) => Promise<boolean>;

  // Function to check if the user has another permission other than those being checked on the controller
  hasPermission?: (
    resource: string,
    resourceId: string,
    permissions: string[],
  ) => Promise<boolean>;

  psTransaction?: Transaction;
}

export interface Response extends BaseResponse {
  success(
    data: Record<string, any> | Array<any> | string | boolean,
    status?: number | string,
  ): any;

  error(error: Record<string, any> | string, status?: number | string): any;

  noContent(): any;

  withMeta(data: Record<string, any>, status?: number | string): any;
}

export interface ServerOptions {
  addValidationContainer?: boolean;
  port?: number;
  rawBody?: boolean;
  globalPrefix?: string;
}

export interface StandaloneAppOptions {
  addValidationContainer?: boolean;
}
