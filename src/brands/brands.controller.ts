// src/brands/brands.controller.ts
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
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { BrandsService } from './brands.service';

@ApiTags('brands')
@ApiBearerAuth()
@Controller('api/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar marcas' })
  findAll(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener marca por id' })
  findOne(@Param('id') id: string): Promise<Brand> {
    return this.brandsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear marca' })
  create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandsService.create(createBrandDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar marca' })
  update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<Brand> {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar marca' })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}
