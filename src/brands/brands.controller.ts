// src/brands/brands.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Brand } from './entities/brand.entity';

@Controller('api/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  findAll(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Brand> {
    return this.brandsService.findOne(+id);
  }

  @Post()
  create(@Body() brand: Brand): Promise<Brand> {
    return this.brandsService.create(brand);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() brand: Partial<Brand>): Promise<Brand> {
    return this.brandsService.update(+id, brand);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}