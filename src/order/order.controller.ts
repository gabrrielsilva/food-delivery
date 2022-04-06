import {
  Body,
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
import { Order, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderStatus } from './models/OrderStatus';
import { AuthUser } from './order.decorator';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('orders')
  async getOrders(): Promise<Order[]> {
    return this.orderService.findAllOrders({
      where: { activeOrder: true },
    });
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string): Promise<Order | null> {
    const order = await this.orderService.findOneOrder({ id: Number(id) });

    if (!order) new NotFoundException('Pedido não encontrado');

    return order;
  }

  @Post('orders')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async makeOrder(
    @Body() orderItems: number[],
    @AuthUser() user: User,
  ): Promise<void> {
    this.orderService.makeOrder(orderItems, user);
  }

  @Patch('orders/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() status: OrderStatus,
  ): Promise<void> {
    const existingOrder = await this.orderService.findOneOrder({
      id: Number(id),
    });

    if (!existingOrder) throw new NotFoundException('Pedido não existe');

    this.orderService.updateOrderStatus({
      where: { id: Number(id) },
      data: status,
    });
  }

  @Delete('orders/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeOrder(@Param('id') id: string): Promise<void> {
    this.orderService.deleteOrder({ id: Number(id) });
  }
}
