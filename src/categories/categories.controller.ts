// src/categories/categories.controller.ts
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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar categorias' })
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener categoria por id' })
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear categoria' })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar categoria' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar categoria' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
