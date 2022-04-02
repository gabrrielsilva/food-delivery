import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [MenuItemModule, AuthModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
