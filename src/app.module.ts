import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { OrderModule } from './order/order.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [MenuItemModule, AuthModule, OrderModule],
  providers: [PrismaService],
})
export class AppModule {}
