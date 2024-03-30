import { Request, Response, RestController } from '@libs/core';
import { Controller, Get, Req, Res } from '@nestjs/common';

import { UserDetailTransformer } from '@src/transformer';

@Controller('')
export class MainController extends RestController {
  constructor() {
    super();
  }

  @Get('')
  async getProfile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    return res.success({ msg: 'hello' });
  }
}
