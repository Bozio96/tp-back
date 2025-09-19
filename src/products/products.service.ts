// src/products/products.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { BulkUpdateProductDto } from './dto/bulk-update-product.dto';
import { PriceChange } from './entities/price-change.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(PriceChange)
    private priceChangeRepository: Repository<PriceChange>,
  ) {}

  findAll() {
    return this.productsRepository.find({
      relations: ['brand', 'category', 'supplier', 'department'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['brand', 'category', 'supplier', 'department'],
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async findAllWithFilters(filters: {
    search?: string;
    brand?: string;
    category?: string;
    supplier?: string;
    department?: string;
  }): Promise<Product[]> {
    const { search, brand, category, supplier, department } = filters;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .leftJoinAndSelect('product.department', 'department');

    if (search) {
      query.andWhere('product.name LIKE :search', { search: `%${search}%` });
    }

    if (brand) {
      query.andWhere('brand.name = :brand', { brand });
    }

    if (category) {
      query.andWhere('category.name = :category', { category });
    }

    if (supplier) {
      query.andWhere('supplier.name = :supplier', { supplier });
    }

    if (department) {
      query.andWhere('department.name = :department', { department });
    }

    return await query.getMany();
  }

  async create(product: any): Promise<Product> {
    // Validar: SKU único
    const existingSku = await this.productsRepository.findOneBy({
      sku: product.sku,
    });
    if (existingSku) {
      throw new ConflictException(
        `Ya existe un producto con el SKU "${product.sku}"`,
      );
    }

    return this.productsRepository.save(product);
  }

  async update(id: number, product: any): Promise<Product> {
    const existing = await this.productsRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Validar: si el SKU cambia, verificar que no esté duplicado
    if (product.sku && product.sku !== existing.sku) {
      const duplicateSku = await this.productsRepository.findOneBy({
        sku: product.sku,
      });
      if (duplicateSku) {
        throw new ConflictException(
          `Ya existe un producto con el SKU "${product.sku}"`,
        );
      }
    }

    // Guardamos el precio anterior antes de actualizar
    const oldSalePrice = existing.salePrice;

    await this.productsRepository.update(id, product);

    const updatedProduct = await this.productsRepository.findOneBy({ id });
    if (!updatedProduct) {
      throw new InternalServerErrorException(
        'Error al recuperar el producto actualizado',
      );
    }

    //Registrar cambio de precio si hubo cambio en salePrice
    if (product.salePrice !== undefined && oldSalePrice !== product.salePrice) {
      const priceChange = new PriceChange();
      priceChange.product = updatedProduct;
      priceChange.oldPrice = oldSalePrice;
      priceChange.newPrice = product.salePrice;

      await this.priceChangeRepository.save(priceChange);
    }

    return updatedProduct;
  }

  async remove(id: number): Promise<boolean> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    await this.productsRepository.delete(id);
    return true;
  }

  async bulkUpdate(
    updates: BulkUpdateProductDto[],
  ): Promise<{ updatedCount: number }> {
    const ids = updates.map((u) => u.id);

    const products = await this.productsRepository.find({
      where: { id: In(ids) },
    });

    if (products.length === 0) {
      throw new NotFoundException('Ningún producto encontrado para actualizar');
    }

    const updatedProducts: Product[] = [];

    for (const update of updates) {
      const product = products.find((p) => p.id === update.id);
      if (!product) continue;

      // Guardamos el precio anterior
      const oldSalePrice = product.salePrice;

      if (update.costBase !== undefined) {
        product.costBase = update.costBase;
      }
      if (update.salePrice !== undefined) {
        product.salePrice = update.salePrice;
        product.price = update.salePrice;
      }
      if (update.utilityPercentage !== undefined) {
        product.utilityPercentage = update.utilityPercentage;
      }

      updatedProducts.push(product);

      //Registrar cambio de precio si hubo cambio
      if (update.salePrice !== undefined && oldSalePrice !== update.salePrice) {
        const priceChange = new PriceChange();
        priceChange.product = product;
        priceChange.oldPrice = oldSalePrice;
        priceChange.newPrice = update.salePrice;

        await this.priceChangeRepository.save(priceChange);
      }
    }

    try {
      await this.productsRepository.save(updatedProducts);
      return { updatedCount: updatedProducts.length };
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar productos');
    }
  }
}
