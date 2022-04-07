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
  Query,
} from '@nestjs/common';
import { MenuItem } from '@prisma/client';
import { MenuItemService } from './menu-item.service';

@Controller()
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Get('menu')
  async getMenu(): Promise<MenuItem[]> {
    return this.menuItemService.getAllMenuItems({
      where: { available: true },
    });
  }

  @Get('menu/:id')
  async getMenuItemById(@Param('id') id: string): Promise<MenuItem | null> {
    const item = await this.menuItemService.getMenuItemById(Number(id));

    if (!item) new NotFoundException('Item não encontrado');

    return item;
  }

  @Get('busca')
  async searchMenuItems(
    @Query('search') searchString: string,
  ): Promise<MenuItem[] | null> {
    const searchedItems = await this.menuItemService.getAllMenuItems({
      where: {
        title: { contains: searchString },
      },
    });

    if (searchedItems.length === 0)
      throw new NotFoundException('Item não encontrado');

    return searchedItems;
  }

  @Post('menu')
  @HttpCode(HttpStatus.CREATED)
  async createMenuItem(@Body() menuItemData: MenuItem): Promise<void> {
    const existingMenuItem = await this.menuItemService.getMenuItemByTitle(
      menuItemData.title,
    );

    if (existingMenuItem) throw new ConflictException('Item já existe');

    this.menuItemService.createMenuItem(menuItemData);
  }

  @Patch('menu/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateMenuItem(
    @Param('id') id: string,
    @Body() menuItemData: MenuItem,
  ): Promise<void> {
    const existingMenuItem = await this.menuItemService.getMenuItemById(
      Number(id),
    );

    if (!existingMenuItem) throw new NotFoundException('Item não encontrado');

    if (menuItemData.title) {
      const existingMenuItemTitle =
        await this.menuItemService.getMenuItemByTitle(menuItemData.title);

      if (existingMenuItemTitle) throw new ConflictException('Item já existe');
    }

    this.menuItemService.updateMenuItem(Number(id), menuItemData);
  }

  @Delete('menu/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMenuItem(@Param('id') id: string): Promise<void> {
    this.menuItemService.deleteMenuItem(Number(id));
  }
}
