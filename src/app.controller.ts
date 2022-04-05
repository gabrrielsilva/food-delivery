import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth/auth.service';
import { Login } from './auth/models/login';

@Controller('auth')
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: Prisma.UserCreateInput): Promise<void> {
    return this.authService.register(user);
  }

  @Post('login')
  async login(
    @Body() loginCredentials: Login,
  ): Promise<{ access_token: string }> {
    return this.authService.login(loginCredentials);
  }
}
