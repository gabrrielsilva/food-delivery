import { Module } from '@nestjs/common';
import { MenuItemService } from 'src/menu-item/menu-item.service';
import { PrismaService } from 'src/prisma.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, MenuItemService],
})
export class OrderModule {}
