/**
 * This file contains the implementation of the `UserPermissionGuard` class, which is a Nest.js guard
 * responsible for checking user permissions and access to resources.
 * It also includes the `Permissions` decorator function and related metadata keys.
 *
 * @module UserPermissionGuard
 */

import { Request, Unauthorized } from '@libs/core';

import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiBearerAuth } from '@nestjs/swagger';

import 'reflect-metadata';
import { Observable } from 'rxjs';

/**
 * Guard for checking user permissions and access to resources.
 */
@Injectable()
export class UserPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    // private readonly users: UserLibService,
  ) {}

  /**
   * Determines if the user is allowed to access the requested resource.
   * @param context - The execution context.
   * @returns A boolean, a promise resolving to a boolean, or an observable emitting a boolean indicating if the user is allowed to access the resource.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.assignUserAndPermissions(context);
  }

  /**
   * Assigns the user to the request object and route permissions if any.
   * @param context - The execution context.
   * @returns A promise resolving to a boolean indicating if the user and permissions were successfully assigned.
   */
  async assignUserAndPermissions(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const permissions = this.reflector.get<string[]>(
      PERMISSIONS_METADATA_KEY,
      context.getHandler(),
    );

    // const user = await this.users.repo.firstWhere(
    //   { email: kcUser.email?.toLowerCase() },
    //   false,
    // );
    const user = {};
    if (!user) {
      throw new Unauthorized();
    }
    request.currentUser = user;

    // request.canAccess = async (resourceType: string, resourceId: string) =>
    //   this.canAccessResource(resourceType, resourceId, request);
    // request.hasPermission = (
    //   resourceType: string,
    //   resourceId: string,
    //   permissions: string[],
    // ) =>
    //   this.checkAccessResource(resourceType, resourceId, permissions, request);

    // const type = this.reflector.get<string>(
    //   RESOURCE_TYPE_METADATA_KEY,
    //   context.getHandler(),
    // );

    // if (type === ADMIN_ONLY) {
    //   return request.isAdmin;
    // }

    // const accessKey = this.reflector.get<string>(
    //   ACCESS_KEY_METADATA_KEY,
    //   context.getHandler(),
    // );

    // const accessFunc = this.reflector.get<CallableFunction>(
    //   ACCESS_FUNC_METADATA_KEY,
    //   context.getHandler(),
    // );
    // if (accessKey) {
    //   const resourceId = request.all()[accessKey];
    //   return await this.canAccessResource(type, resourceId, request);
    // } else if (accessFunc) {
    //   return accessFunc({ req: request, type: type });
    // }

    return true;
  }

  /**
   * Checks if the user has access to the specified resource.
   * @param resourceType - The type of the resource.
   * @param resourceId - The ID of the resource.
   * @param req - The request object.
   * @returns A promise resolving to a boolean indicating if the user has access to the resource.
   */
  // async canAccessResource(
  //   resourceType: string,
  //   resourceId: string,
  //   req: Request,
  // ): Promise<boolean> {
  //   const user = req.currentUser;
  //   const permissions = req.routePermissions;

  //   if (req.isAdmin) return true;

  //   if (!permissions?.length) {
  //     return true;
  //   }
  //   if (!user) {
  //     throw new Unauthorized();
  //   }
  //   const roles = await this.authLibService.getUserRoleForResource(
  //     user,
  //     resourceType,
  //     resourceId,
  //   );
  //   if (!roles.length) {
  //     throw new ForbiddenException("You don't have access to this resource");
  //   }
  //   const roleId = roles[0];
  //   const rolePermissions: IRolePermission[] =
  //     await this.authLibService.rolesPermission.getWhere(
  //       { roleId: roleId },
  //       false,
  //     );

  //   const effectiveRolePermissions = new Set(
  //     rolePermissions.map((rolePermission) => rolePermission.permission),
  //   );
  //   const hasPermission = permissions.some((permission) =>
  //     effectiveRolePermissions.has(permission),
  //   );
  //   if (!hasPermission)
  //     throw new ForbiddenException(
  //       `Access denied. You don't have the required permissions to perform this action.
  //       Please contact your company administrator for assistance.
  //       `,
  //     );

  //   return hasPermission;
  // }

  /**
   * Checks if the user has the specified permission for the resource.
   * @param resourceType - The type of the resource.
   * @param resourceId - The ID of the resource.
   * @param permission - The permission to check.
   * @param req - The request object.
   * @returns A promise resolving to a boolean indicating if the user has the permission for the resource.
   */
  //   async checkAccessResource(
  //     resourceType: string, // The type of resource to check access for
  //     resourceId: string, // The ID of the resource to check access for
  //     permission: string[], // The permissions required to access the resource
  //     req: Request, // The request object, containing the current user and their roles
  //   ): Promise<boolean> {
  //     // Returns a promise that resolves to a boolean indicating whether the user has access
  //     const user = req.currentUser; // Get the current user from the request

  //     // If the user is an admin, they have access to all resources
  //     if (req.isAdmin) return true;

  //     // If no specific permissions are required to access the resource, all users have access
  //     if (!permission?.length) {
  //       return true;
  //     }

  //     // If there is no user, throw an Unauthorized exception
  //     if (!user) {
  //       throw new Unauthorized();
  //     }

  //     // Get the roles the user has for this resource
  //     const roles = await this.authLibService.getUserRoleForResource(
  //       user,
  //       resourceType,
  //       resourceId,
  //     );

  //     // If the user has no roles for this resource, throw a ForbiddenException
  //     if (!roles.length) {
  //       throw new ForbiddenException("You don't have access to this resource");
  //     }

  //     // Get the ID of the first role the user has for this resource
  //     const roleId = roles[0];

  //     // Get the permissions associated with the user's role
  //     const rolePermissions: IRolePermission[] =
  //       await this.authLibService.rolesPermission.getWhere(
  //         { roleId: roleId },
  //         false,
  //       );

  //     // Create a Set of the permissions for easy lookup
  //     const effectiveRolePermissions = new Set(
  //       rolePermissions.map((rolePermission) => rolePermission.permission),
  //     );

  //     // Check if the user has any of the required permissions
  //     const hasPermission = permission.some((permission) =>
  //       effectiveRolePermissions.has(permission),
  //     );

  //     // Return whether the user has the required permissions
  //     return hasPermission;
  //   }
  // }

  /**
   * Decorator function to apply permissions and access control to a route handler.
   * @param permissions - The permissions required to access the route.
   * @param type - The type of the resource.
   * @param accessMethod - The method or key to access the resource.
   * @returns A decorator function.
   */
  // export function Permissions(
  //   permissions?: string | string[],
  //   type?: string,
  //   accessMethod?:
  //     | string
  //     | (({ req, type }: { req: Request; type: string }) => boolean),
  // ) {
  //   permissions = typeof permissions === 'string' ? [permissions] : permissions;
  //   return applyDecorators(
  //     SetMetadata(PERMISSIONS_METADATA_KEY, permissions),
  //     SetMetadata(RESOURCE_TYPE_METADATA_KEY, type),
  //     typeof accessMethod === 'string'
  //       ? SetMetadata(ACCESS_KEY_METADATA_KEY, accessMethod)
  //       : SetMetadata(ACCESS_FUNC_METADATA_KEY, accessMethod),
  //     UseGuards(AuthGuard, UserPermissionGuard),
  //     ApiBearerAuth(),
  //   );
  // }
}
export const PERMISSIONS_METADATA_KEY = '__permissions__';
export const RESOURCE_TYPE_METADATA_KEY = '__resource_type__';
export const ACCESS_KEY_METADATA_KEY = '__access_key__';
export const ACCESS_FUNC_METADATA_KEY = '__access_func__';

export const ADMIN_ONLY = '__admin__';
