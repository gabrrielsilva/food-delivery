import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [MenuItemModule, AuthModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
