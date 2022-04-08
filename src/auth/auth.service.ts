import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { useValidationsBR } from 'validations-br';
import { Login } from './models/login';
import { Register } from './models/Register';

@Injectable()
export class AuthService {
  user: User;

  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async login(loginCredentials: Login): Promise<{ access_token: string }> {
    const { emailOrPhoneNumber } = loginCredentials;
    const { accountPassword } = loginCredentials;

    const loginWithEmail = useValidationsBR('email', emailOrPhoneNumber);
    const loginWithPhoneNumber = useValidationsBR('phone', emailOrPhoneNumber);

    if (loginWithEmail) {
      this.user = await this.prisma.user.findUnique({
        where: { email: emailOrPhoneNumber },
      });
    }

    if (loginWithPhoneNumber) {
      this.user = await this.prisma.user.findUnique({
        where: { phoneNumber: emailOrPhoneNumber },
      });
    }

    if (!this.user) throw new UnauthorizedException('Usuário não existe');

    const passwordCompare = await bcryptjs.compare(
      accountPassword,
      this.user.password,
    );

    if (!passwordCompare) throw new UnauthorizedException('Senha incorreta');

    const payload = {
      sub: this.user.id,
      email: this.user.email,
      admin: this.user.isAdmin,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerCredentials: Register): Promise<void> {
    const { user } = registerCredentials;
    const { address } = registerCredentials;

    const emailIsValid = useValidationsBR('email', user.email);
    const phoneNumberIsValid = useValidationsBR('phone', user.phoneNumber);
    const ufIsValid = useValidationsBR('uf', address.state);

    if (
      !emailIsValid ||
      !phoneNumberIsValid ||
      !ufIsValid ||
      typeof address.number !== 'number'
    ) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    const phoneNumberAlreadyExists = await this.prisma.user.findUnique({
      where: { phoneNumber: user.phoneNumber },
    });

    if (emailAlreadyExists || phoneNumberAlreadyExists) {
      throw new ConflictException('Usuário já existe');
    }

    const passwordHash = await bcryptjs.hash(user.password, 10);

    await this.prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        password: passwordHash,
        address: {
          create: {
            street: address.street,
            number: address.number,
            district: address.district,
            city: address.city,
            state: address.state,
          },
        },
        phoneNumber: user.phoneNumber,
        profilePictureUrl: user.profilePictureUrl,
      },
    });
  }
}
