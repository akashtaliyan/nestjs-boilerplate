import { Request, Response, RestController } from '@libs/core';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { UserService } from '../services';
import { UserDetailTransformer } from '@src/transformer';
import { Dto, Validate } from '@libs/core/validator';
import { GetUserByIdOrEmailDto } from '../validators';
import { Post } from '@libs/common';
import { Restricted } from '@libs/core/guards';

@Controller('users')
export class UserController extends RestController {
  constructor(private service: UserService) {
    super();
  }

  @Get('/profile')
  // @Restricted('ADMIN', 'USER', 'GUEST')
  async getProfile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    console.log(req.user);
    return res.success(req.user);
  }
  @Post('/profile')
  @Validate(GetUserByIdOrEmailDto)
  async set(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: GetUserByIdOrEmailDto,
  ): Promise<Response> {
    const user = await this.service.getUserByIdOrEmail(inputs);
    return res.success(user);
  }
}
