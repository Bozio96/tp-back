// src/suppliers/suppliers.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { SuppliersService } from './suppliers.service';

@ApiTags('suppliers')
@ApiBearerAuth()
@Controller('api/suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar proveedores' })
  findAll(): Promise<Supplier[]> {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener proveedor por id' })
  findOne(@Param('id') id: string): Promise<Supplier> {
    return this.suppliersService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear proveedor' })
  create(@Body() createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    return this.suppliersService.create(createSupplierDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar proveedor' })
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return this.suppliersService.update(+id, updateSupplierDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar proveedor' })
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(+id);
  }
}
