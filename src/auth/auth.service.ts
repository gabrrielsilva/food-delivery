import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.userAdmin.findUnique({
      where: { username },
    });

    if (!user) return null;

    const passwordCompare = await bcryptjs.compare(password, user.password);

    if (!passwordCompare) return null;

    return user.id;
  }

  async login(user: any): Promise<{ access_token: any }> {
    return {
      access_token: this.jwtService.sign({ sub: user }),
    };
  }
}
