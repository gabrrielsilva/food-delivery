import { Injectable } from '@nestjs/common';
import { MenuItem, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) {}

  async findAllMenuItems(params: {
    where?: Prisma.MenuItemWhereInput;
  }): Promise<MenuItem[] | null> {
    const { where } = params;

    return this.prisma.menuItem.findMany({
      where,
    });
  }

  async findOneMenuItem(
    menuItemWhereUniqueInput: Prisma.MenuItemWhereUniqueInput,
  ): Promise<MenuItem | null> {
    return this.prisma.menuItem.findUnique({
      where: menuItemWhereUniqueInput,
    });
  }

  async createMenuItem(data: Prisma.MenuItemCreateInput): Promise<void> {
    await this.prisma.menuItem.create({
      data,
    });
  }

  async updateMenuItem(params: {
    where: Prisma.MenuItemWhereUniqueInput;
    data: Prisma.MenuItemUpdateInput;
  }): Promise<void> {
    const { where, data } = params;

    await this.prisma.menuItem.update({
      where,
      data,
    });
  }

  async deleteMenuItem(where: Prisma.MenuItemWhereUniqueInput): Promise<void> {
    await this.prisma.menuItem.delete({
      where,
    });
  }
}
