import { Injectable } from '@nestjs/common';
import { Order, Prisma, Status } from '@prisma/client';
import { MenuItemService } from 'src/menu-item/menu-item.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private menuItem: MenuItemService,
  ) {}

  async getAllOrders(params: {
    where?: Prisma.OrderWhereInput;
  }): Promise<Order[] | null> {
    const { where } = params;

    return this.prisma.order.findMany({
      where,
    });
  }

  async getOrderById(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  async makeOrder(
    orderItems: number[],
    user: any,
    mininumOrderPrice: number,
  ): Promise<{ items: any[]; amount: number }> {
    const items: any[] = [];
    let amount = 0;

    for await (const itemId of orderItems['items']) {
      const findItem = await this.menuItem.getMenuItemById(itemId);

      const formatArrayOfItemsToObjectWithKeyAndValueId = (id: number) => {
        // Prisma relation:
        // connect: [
        //   {
        //     id: id
        //   },
        //   ...
        // ]

        return {
          id,
        };
      };

      const item = formatArrayOfItemsToObjectWithKeyAndValueId(findItem.id);

      amount += findItem.price;
      items.push(item);
    }

    if (amount < mininumOrderPrice) return { items, amount };

    await this.prisma.order.create({
      data: {
        user: {
          connect: {
            id: user.userId,
          },
        },
        items: {
          connect: items,
        },
        amount,
      },
    });

    return { items, amount };
  }

  async updateOrderStatus(id: number, status: Status): Promise<void> {
    await this.prisma.order.update({
      where: { id },
      data: {
        status: {
          set: status,
        },
      },
    });
  }

  async deleteOrder(id: number): Promise<void> {
    await this.prisma.order.delete({
      where: {
        id,
      },
    });
  }
}
