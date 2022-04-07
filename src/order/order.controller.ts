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
import { Order, Status } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from './current-user';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders({
      where: { activeOrder: true },
    });
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order | null> {
    const order = await this.orderService.getOrderById(Number(id));

    if (!order) new NotFoundException('Pedido não encontrado');

    return order;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async makeOrder(
    @Body() orderItems: number[],
    @AuthUser() user: any,
  ): Promise<void> {
    this.orderService.makeOrder(orderItems, user);
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
