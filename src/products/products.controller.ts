import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BulkUpdateProductDto } from './dto/bulk-update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@ApiTags('products')
@ApiBearerAuth()
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por id' })
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar productos con filtros opcionales' })
  async findAllWithFilters(
    @Query('search') search?: string,
    @Query('brand') brand?: string,
    @Query('category') category?: string,
    @Query('supplier') supplier?: string,
    @Query('department') department?: string,
  ): Promise<Product[]> {
    return this.productsService.findAllWithFilters({
      search,
      brand,
      category,
      supplier,
      department,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Crear un producto' })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
    return { success: true };
  }

  @Patch('bulk-update')
  @ApiOperation({ summary: 'Actualizar masivamente productos' })
  async bulkUpdate(
    @Body() updates: BulkUpdateProductDto[],
  ): Promise<{ success: boolean; updatedCount: number }> {
    const result = await this.productsService.bulkUpdate(updates);
    return {
      success: true,
      updatedCount: result.updatedCount,
    };
  }
}
