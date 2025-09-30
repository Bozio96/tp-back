import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BulkUpdateProductDto } from './dto/bulk-update-product.dto';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(+id);
  }

  @Get()
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
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
    return { success: true };
  }

  @Patch('bulk-update')
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
