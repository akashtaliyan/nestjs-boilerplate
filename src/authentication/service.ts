import {
  Injectable,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';

import { LoginWithEmailDto, SignUpEmailDto } from './validators';
import { JwtService } from '@nestjs/jwt';
import {
  ITokenPayload,
  comparePassword,
  hashPassword,
} from '@src/libs/common/src';
import { UserModel, UserLibService } from '@src/libs/user/src';
import moment from 'moment';
import { RequestContext } from '@libs/core';

@Injectable()
export class AuthenticationService {
  constructor(
    public userService: UserLibService,
    private readonly jwtService: JwtService,
    private readonly reqContext: RequestContext,
  ) {} // UserService handles interaction with the user repository

  async signUpWithEmail(inputs: SignUpEmailDto): Promise<any> {
    const { firstName, email, lastName, password } = inputs;

    // check if user is already signedUP.

    const exists = await this.userService.usersRepo.firstWhere(
      {
        email: inputs.email,
      },
      false,
    );
    if (exists) {
      throw new UnprocessableEntityException(
        'User already Exist Please signIn.',
      );
    }
    const passHash = await hashPassword(password);

    // create user
    try {
      const user = await this.userService.usersRepo.create({
        firstName,
        lastName,
        email,
        username: email,
        passwordHash: passHash,
      });
      return await this.getTokens(user);
    } catch (error) {
      console.log(
        `🚀 - AuthenticationService - signUpWithEmail - error:`,
        error,
      );
      throw new UnprocessableEntityException('Some thing went Wrong.');
    }
  }

  async loginWithEmail(inputs: LoginWithEmailDto): Promise<any> {
    const { email, password } = inputs;

    // check if user is already signedUP.

    const user = await this.userService.usersRepo.firstWhere(
      {
        email: email,
      },
      false,
    );
    if (!user) {
      throw new UnprocessableEntityException(
        'User does not exist Please signup.',
      );
    }

    // check if password matches
    const passCheck = await comparePassword(password, user.passwordHash);
    if (!passCheck) {
      throw new UnprocessableEntityException('Invalid Credentials.');
    }

    return await this.getTokens(user);
  }

  // OAuth logic, e.g., Google
  async googleLogin(user: any): Promise<any> {
    // Implement logic to handle user data received from Google
    // You might create a new user or update an existing user based on the provided email or provider_id
  }

  // Implement other methods as needed
  async getTokens(user: UserModel) {
    const token = await this.getToken(this.getTokenPayload(user));

    return {
      access_token: token,
      refresh_token: this.generateRefreshToken(user), // Generate the refresh token
    };
  }
  getTokenPayload(user: UserModel): ITokenPayload {
    const payload = {
      username: user.username,
      sub: user.uuid,
      name: user.firstName + ' ' + user.lastName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    return payload;
  }

  // Generate the access token
  async getToken(payload: ITokenPayload) {
    const token = this.jwtService.sign(payload);
    const decodedToken = this.jwtService.decode(token);

    const expiryDate = moment(decodedToken.exp * 1000);
    // Return the access token and refresh token and store it in the db
    await this.userService.usersTokensRepo.create({
      userId: payload.sub,
      token: token,
      lastUsed: moment().toDate(),
      expiryDate: expiryDate.toDate(),
      meta: {},
      isExpired: false,
    });
    return token;
  }

  generateRefreshToken(user: UserModel) {
    return this.jwtService.sign(this.getTokenPayload(user), {
      expiresIn: '365d', // Refresh token expiry time
      secret: process.env.JWT_REFRESH_SECRET || 'JWT_REFRESH_SECRET', // Separate secret for refresh token
    });
  }

  async refreshToken() {
    const user = this.reqContext.req.currentUser as UserModel;

    // update the old token to disabled
    return { access_token: await this.getToken(this.getTokenPayload(user)) };
  }

  async logout() {
    const user = this.reqContext.req.currentUser as UserModel;
    const token = this.reqContext.req?.['access_token'];
    if (!token) {
      return { message: 'Already logged out' };
    }
    // update the old token to expired
    await this.userService.usersTokensRepo.updateWhere(
      { userId: user.uuid, token: token },
      { isExpired: true },
    );
    return { message: 'Logged out successfully' };
  }
}
