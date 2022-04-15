import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Order, Status } from '@prisma/client';
import { Role } from 'src/auth/admin/admin.decorator';
import { AdminGuard } from 'src/auth/admin/admin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from './current-user';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Role('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllOrders(): Promise<Order[] | null> {
    return this.orderService.getAllOrders({
      where: { activeOrder: true },
    });
  }

  @Get(':id')
  @Role('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getOrderById(@Param('id') id: string): Promise<Order | null> {
    const order = await this.orderService.getOrderById(Number(id));

    if (!order) throw new NotFoundException('Pedido não encontrado');

    return order;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async makeOrder(
    @Body() orderItems: number[],
    @AuthUser() user: any,
  ): Promise<void> {
    const minimumOrderPriceNotReached = await this.orderService.makeOrder(
      orderItems,
      user,
    );

    if (minimumOrderPriceNotReached) {
      throw new ConflictException(`O valor mínimo do pedido não foi atingido`);
    }
  }

  @Patch(':id')
  @Role('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() status: Status,
  ): Promise<void> {
    const existingOrder = await this.orderService.getOrderById(Number(id));

    if (!existingOrder) throw new NotFoundException('Pedido não existe');

    this.orderService.updateOrderStatus(Number(id), status['status']);
  }

  @Delete(':id')
  @Role('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteOrder(@Param('id') id: string): Promise<void> {
    this.orderService.deleteOrder(Number(id));
  }
}
