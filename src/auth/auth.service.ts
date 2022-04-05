import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
import * as email from 'email-validator';
import { PrismaService } from 'src/prisma.service';
import * as phoneNumber from 'validate-phone-number-node-js';
import { Login } from './models/login';

@Injectable()
export class AuthService {
  user: User;

  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async login(loginCredentials: Login): Promise<{ access_token: string }> {
    const emailOrPhoneNumber = loginCredentials.emailOrPhoneNumber;
    const accountPassword = loginCredentials.accountPassword;

    if (typeof emailOrPhoneNumber === 'string') {
      this.user = await this.prisma.user.findUnique({
        where: { email: emailOrPhoneNumber },
      });
    }

    if (typeof emailOrPhoneNumber === 'number') {
      this.user = await this.prisma.user.findUnique({
        where: { phoneNumber: emailOrPhoneNumber },
      });
    }

    if (!this.user) this.invalidCredentials();

    const passwordCompare = await bcryptjs.compare(
      accountPassword,
      this.user.password,
    );

    if (!passwordCompare) this.invalidCredentials();

    const payload = { sub: this.user.id, email: this.user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: Prisma.UserCreateInput): Promise<void> {
    const emailIsValid = email.validate(user.email);
    const phoneNumberIsValid = phoneNumber.validate(`+550${user.phoneNumber}`);

    if (!emailIsValid || !phoneNumberIsValid) this.invalidCredentials();

    const existingEmail = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    const existingPhoneNumber = await this.prisma.user.findUnique({
      where: { phoneNumber: user.phoneNumber },
    });

    if (existingEmail || existingPhoneNumber) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Usuário já existe',
        },
        HttpStatus.CONFLICT,
      );
    }

    const passwordHash = await bcryptjs.hash(user.password, 10);

    await this.prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        password: passwordHash,
        address: user.address,
        phoneNumber: Number(user.phoneNumber),
        profilePictureUrl: user.profilePictureUrl,
      },
    });
  }

  invalidCredentials() {
    throw new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: 'Credenciais inválidas',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
