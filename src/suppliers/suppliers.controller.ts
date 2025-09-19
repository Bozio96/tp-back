// src/suppliers/suppliers.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './entities/supplier.entity';

@Controller('api/suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  findAll(): Promise<Supplier[]> {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Supplier> {
    return this.suppliersService.findOne(+id);
  }

  @Post()
  create(@Body() supplier: Supplier): Promise<Supplier> {
    return this.suppliersService.create(supplier);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() supplier: Partial<Supplier>,
  ): Promise<Supplier> {
    return this.suppliersService.update(+id, supplier);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(+id);
  }
}
