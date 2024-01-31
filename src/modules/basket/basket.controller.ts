import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { ApiQuery } from '@nestjs/swagger';
import { FindAllBasketDto } from './dto/findAll-basket.dto';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  create(@Body() createBasketDto: CreateBasketDto) {
    return this.basketService.create(createBasketDto);
  }

  @Get()
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  findAll(@Query() findAllBasketDto: FindAllBasketDto) {
    return this.basketService.findAll(findAllBasketDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.basketService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBasketDto: UpdateBasketDto) {
    return this.basketService.update(+id, updateBasketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.basketService.remove(+id);
  }
}
