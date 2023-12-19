import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  WithExpiredTokenOnly,
  WithoutTokenOnly,
} from './decorators/token-meta.decoratios';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { RegisterDTO } from './interfaces/register.dto';
import { LoginDTO } from './interfaces/login.dto';
import { Request, Response } from 'express';
import { ForgotPasswordDTO } from './interfaces/forgot-password.dto';

@UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @WithoutTokenOnly()
  @Post(`register`)
  async register(@Body() registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
  }

  @WithoutTokenOnly()
  @Post(`login`)
  async login(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDTO, res);
  }

  @WithExpiredTokenOnly()
  @Get('refresh-token')
  async refreshToken(@Req() req: Request) {
    return this.authService.processRefreshToken(req);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    return this.authService.forgotPassword(forgotPasswordDTO);
  }
}
