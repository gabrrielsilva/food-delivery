import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
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
    return this.menuItemService.findAllMenuItems({
      where: { available: true },
    });
  }

  @Get('menu/:id')
  async getMenuItemById(@Param('id') id: string): Promise<MenuItem | null> {
    const item = await this.menuItemService.findOneMenuItem({ id: Number(id) });

    if (!item) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Item não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return item;
  }

  @Get('busca')
  async searchMenuItems(
    @Query('search') searchString: string,
  ): Promise<MenuItem[] | null> {
    const searchedItems = await this.menuItemService.findAllMenuItems({
      where: {
        title: { contains: searchString },
      },
    });

    if (searchedItems.length === 0) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Item não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return searchedItems;
  }

  @Post('menu')
  @HttpCode(HttpStatus.CREATED)
  async createMenuItem(@Body() menuItemData: MenuItem): Promise<void> {
    const existingMenuItem = await this.menuItemService.findOneMenuItem({
      title: menuItemData.title,
    });

    if (existingMenuItem) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Item já existe',
        },
        HttpStatus.CONFLICT,
      );
    }

    this.menuItemService.createMenuItem(menuItemData);
  }

  @Patch('menu/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateMenuItem(
    @Param('id') id: string,
    @Body() menuItemData: MenuItem,
  ): Promise<void> {
    const existingMenuItem = await this.menuItemService.findOneMenuItem({
      id: Number(id),
    });

    if (!existingMenuItem) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Item não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (menuItemData.title) {
      const existingMenuItemTitle = await this.menuItemService.findOneMenuItem({
        title: menuItemData.title,
      });

      if (existingMenuItemTitle) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Item já existe',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    this.menuItemService.updateMenuItem({
      where: { id: Number(id) },
      data: menuItemData,
    });
  }

  @Delete('menu/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMenuItem(@Param('id') id: string): Promise<void> {
    this.menuItemService.deleteMenuItem({ id: Number(id) });
  }
}
