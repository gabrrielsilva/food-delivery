import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRATION },
    }),
  ],
  exports: [AuthService],
  providers: [AuthService, PrismaService, JwtStrategy],
})
export class AuthModule {}
