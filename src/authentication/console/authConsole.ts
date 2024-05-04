import { Inject, Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '@libs/nestjs-console';
import { UserLibService } from '@src/libs/user/src';
import { ROLES, hashPassword } from '@libs/common';
import { UniqueViolationError } from 'objection';

@Injectable()
export class AuthConsoleCommand {
  constructor(private readonly userService: UserLibService) {}

  @Command('ADD:roles', {
    desc: 'Command to add default roles',
  })
  public async addDefaultRoles(_cli: ConsoleIO): Promise<void> {
    // create roles "ADMIN", "USER", "SUPER_ADMIN"
    const roles: Array<{ name: string }> = Object.values(ROLES).map((role) => {
      return {
        name: role,
      };
    });
    const trx = await this.userService.rolesRepo.transaction();

    try {
      await this.userService.rolesRepo.bulkInsert(roles, trx);
      await trx.commit();
    } catch (error) {
      console.log(`🚀 - AuthConsoleCommand - addDefaultRoles - error:`, error);
      await trx.rollback();
      if (error instanceof UniqueViolationError) {
        _cli.error('Roles already created.');
        return;
      }
      _cli.error('Error while creating roles');
      return;
    }
    console.log('ROLES CREATED SUCCESSFULLY, ');
    _cli.table([]);
  }

  @Command('ADD:superUser', {
    desc: 'Command to add super user',
  })
  public async addSuperUser(_cli: ConsoleIO): Promise<void> {
    // check if the roles are created
    const roles = await this.userService.rolesRepo.all();
    if (!roles.length) {
      _cli.error('Please create roles first');
      return;
    }
    // check if user already exists with super admin role
    const roleId = await this.userService.rolesRepo.firstWhere(
      { name: ROLES.SUPER_ADMIN },
      false,
    );
    if (!roleId) {
      _cli.error('Please create roles first');
      return;
    }
    const rolesMapping = await this.userService.userRolesRepo.firstWhere(
      {
        roleId: roleId.uuid,
      },
      false,
    );
    if (rolesMapping) {
      _cli.error('Super user already created');
      return;
    }
    // ask for user details
    const email = await _cli.ask('Enter email');
    // check if user is already exits
    const exists = await this.userService.usersRepo.firstWhere(
      {
        email,
      },
      false,
    );
    if (exists) {
      _cli.error('User already Exist Please signIn.');
      return;
    }
    const firstName = await _cli.ask('Enter first name');
    const lastName = await _cli.ask('Enter last name');
    const password = await _cli.ask('Enter password');

    const trx = await this.userService.rolesRepo.transaction();
    try {
      // create user
      const passHash = await hashPassword(password);
      const user = await this.userService.usersRepo.create({
        firstName,
        lastName,
        email,
        username: email,
        passwordHash: passHash,
      });
      // assign super admin role to user

      await this.userService.userRolesRepo.create(
        {
          roleId: roleId.uuid,
          userId: user.uuid,
        },
        trx,
      );
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      _cli.error('Error while creating user');
      return;
    }
    console.log('USER CREATED SUCCESSFULLY, ');
    _cli.table([]);
  }
}
