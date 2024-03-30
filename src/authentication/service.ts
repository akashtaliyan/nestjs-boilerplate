import {
  Injectable,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserModel, UserService } from '@src/user';
import { LoginWithEmailDto, SignUpEmailDto } from './validators';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    public userService: UserService,
    private readonly jwtService: JwtService,
  ) {} // Assuming UserService handles interaction with the user repository

  async signUpWithEmail(inputs: SignUpEmailDto): Promise<any> {
    const { firstName, confirmPassword, email, lastName, password } = inputs;

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

    // create user
    try {
      const user = await this.userService.usersRepo.create({
        firstName,
        lastName,
        email,
        username: email,
        passwordHash: password,
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

    if (password !== user.passwordHash) {
      throw new UnprocessableEntityException('Credentials Invalid');
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
    const payload = {
      username: user.username,
      sub: user.uuid,
      name: user.firstName + ' ' + user.lastName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.generateRefreshToken(user), // Generate the refresh token
    };
  }

  generateRefreshToken(user: UserModel) {
    const payload = {
      username: user.username,
      sub: user.uuid,
      name: user.firstName + ' ' + user.lastName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    return this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh token expiry time
      secret: process.env.JWT_REFRESH_SECRET || 'JWT_REFRESH_SECRET', // Separate secret for refresh token
    });
  }

  async refreshToken(token: string) {
    // Decode the refresh token, verify the expiry and signature
    // Optionally check against a list of tokens you have stored in a DB
    // Create a new access token and return it
  }
}
