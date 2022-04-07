import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Order, Status } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from './current-user';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders(): Promise<Order[] | null> {
    return this.orderService.getAllOrders({
      where: { activeOrder: true },
    });
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order | null> {
    const order = await this.orderService.getOrderById(Number(id));

    if (!order) throw new NotFoundException('Pedido não encontrado');

    return order;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async makeOrder(
    @Body() orderItems: number[],
    @AuthUser() user: any,
  ): Promise<{ items: any[]; amount: number }> {
    const MINIMUM_ORDER_PRICE = 25;

    const orderDetails = await this.orderService.makeOrder(
      orderItems,
      user,
      MINIMUM_ORDER_PRICE,
    );
    const { items, amount } = orderDetails;

    if (amount < MINIMUM_ORDER_PRICE) {
      throw new ConflictException(
        `O valor mínimo do pedido é de R$${MINIMUM_ORDER_PRICE},00`,
      );
    }

    return { items, amount };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() status: Status,
  ): Promise<void> {
    const existingOrder = await this.orderService.getOrderById(Number(id));

    if (!existingOrder) throw new NotFoundException('Pedido não existe');

    this.orderService.updateOrderStatus(Number(id), status['status']);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrder(@Param('id') id: string): Promise<void> {
    this.orderService.deleteOrder(Number(id));
  }
}
