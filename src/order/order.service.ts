import { Injectable } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { MenuItemService } from 'src/menu-item/menu-item.service';
import { PrismaService } from 'src/prisma.service';
import { OrderStatus } from './models/OrderStatus';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private menuItem: MenuItemService,
  ) {}

  async findAllOrders(params: {
    where?: Prisma.OrderWhereInput;
  }): Promise<Order[] | null> {
    const { where } = params;

    return this.prisma.order.findMany({
      where,
    });
  }

  async findOneOrder(
    orderWhereUniqueInput: Prisma.OrderWhereUniqueInput,
  ): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: orderWhereUniqueInput,
    });
  }

  async makeOrder(orderItems: number[], user: any): Promise<void> {
    const items: any[] = [];
    const amount = 0;
    const defaultStatus: OrderStatus = 1; //EM_PREPARO

    for await (const itemId of orderItems['items']) {
      const findItem = await this.menuItem.findMenuItemById(itemId);
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

      items.push(item);
    }

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
        status: defaultStatus,
        amount,
      },
    });
  }

  async updateOrderStatus(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: OrderStatus;
  }): Promise<void> {
    const { where, data } = params;

    await this.prisma.order.update({
      where,
      data: {
        status: data,
      },
    });
  }

  async deleteOrder(where: Prisma.OrderWhereUniqueInput): Promise<void> {
    await this.prisma.order.delete({
      where,
    });
  }
}
