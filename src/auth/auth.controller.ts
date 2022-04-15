import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from './models/login';
import { Register } from './models/Register';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerCredentials: Register): Promise<void> {
    return this.authService.register(registerCredentials);
  }

  @Post('login')
  async login(
    @Body() loginCredentials: Login,
  ): Promise<{ access_token: string }> {
    return this.authService.login(loginCredentials);
  }
}
