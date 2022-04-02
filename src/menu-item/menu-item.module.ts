import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MenuItemController } from './menu-item.controller';
import { MenuItemService } from './menu-item.service';

@Module({
  controllers: [MenuItemController],
  providers: [MenuItemService, PrismaService],
})
export class MenuItemModule {}
