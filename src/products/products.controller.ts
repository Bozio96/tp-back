
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { BulkUpdateProductDto } from './dto/bulk-update-product.dto';

@Controller('api/products') // 👈 Todos los endpoints empezarán con /api/products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 🟢 GET /api/products/:id
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



  // ➕ POST /api/products
  @Post()
  create(@Body() product: Product): Promise<Product> {
    return this.productsService.create(product);
  }

  

  // ✏️ PUT /api/products/1
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() product: Partial<Product> // 👈 Partial porque no necesitas enviar todo
  ): Promise<Product> {
    return this.productsService.update(+id, product);
  }

  // 🗑️ DELETE /api/products/1
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
    return { success: true };
  }

   @Patch('bulk-update')
  async bulkUpdate(
    @Body() updates: BulkUpdateProductDto[]
  ): Promise<{ success: boolean; updatedCount: number }> {
    const result = await this.productsService.bulkUpdate(updates);
    return {
      success: true,
      updatedCount: result.updatedCount,
    };
  }
}
