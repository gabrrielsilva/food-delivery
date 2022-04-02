import { Module } from '@nestjs/common';
import { MenuItemModule } from './menu-item/menu-item.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [MenuItemModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
