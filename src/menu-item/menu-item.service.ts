import { Injectable } from '@nestjs/common';
import { MenuItem, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) {}

  async getAllMenuItems(params: {
    where?: Prisma.MenuItemWhereInput;
  }): Promise<MenuItem[] | null> {
    const { where } = params;

    return this.prisma.menuItem.findMany({
      where,
    });
  }

  async getMenuItemById(id: number): Promise<MenuItem | null> {
    return this.prisma.menuItem.findUnique({
      where: { id },
    });
  }

  async getMenuItemByTitle(title: string): Promise<MenuItem | null> {
    return this.prisma.menuItem.findUnique({
      where: { title },
    });
  }

  async createMenuItem(data: Prisma.MenuItemCreateInput): Promise<void> {
    await this.prisma.menuItem.create({
      data,
    });
  }

  async updateMenuItem(
    id: number,
    data: Prisma.MenuItemUpdateInput,
  ): Promise<void> {
    await this.prisma.menuItem.update({
      where: { id },
      data,
    });
  }

  async deleteMenuItem(id: number): Promise<void> {
    await this.prisma.menuItem.delete({
      where: { id },
    });
  }
}
