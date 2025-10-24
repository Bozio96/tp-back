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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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
      where: { isDeleted: false },
      relations: ['brand', 'category', 'supplier', 'department'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id, isDeleted: false },
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
      .leftJoinAndSelect('product.department', 'department')
      .andWhere('product.isDeleted = :isDeleted', { isDeleted: false });

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

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingSku = await this.productsRepository.findOneBy({
      sku: createProductDto.sku,
    });
    if (existingSku) {
      throw new ConflictException(
        `Ya existe un producto con el SKU "${createProductDto.sku}"`,
      );
    }

    const product = this.productsRepository.create(
      createProductDto as unknown as Product,
    );
    return this.productsRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const existing = await this.productsRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['brand', 'category', 'supplier', 'department'],
    });
    if (!existing) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    if (updateProductDto.sku && updateProductDto.sku !== existing.sku) {
      const duplicateSku = await this.productsRepository.findOneBy({
        sku: updateProductDto.sku,
      });
      if (duplicateSku) {
        throw new ConflictException(
          `Ya existe un producto con el SKU "${updateProductDto.sku}"`,
        );
      }
    }

    const oldSalePrice = existing.salePrice;

    await this.productsRepository.update(
      id,
      updateProductDto as unknown as Product,
    );

    const updatedProduct = await this.productsRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['brand', 'category', 'supplier', 'department'],
    });
    if (!updatedProduct) {
      throw new InternalServerErrorException(
        'Error al recuperar el producto actualizado',
      );
    }

    if (
      updateProductDto.salePrice !== undefined &&
      oldSalePrice !== updateProductDto.salePrice
    ) {
      const priceChange = new PriceChange();
      priceChange.product = updatedProduct;
      priceChange.oldPrice = oldSalePrice;
      priceChange.newPrice = updateProductDto.salePrice;

      await this.priceChangeRepository.save(priceChange);
    }

    return updatedProduct;
  }

  async remove(id: number): Promise<boolean> {
    const product = await this.productsRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    product.isDeleted = true;

    await this.productsRepository.save(product);
    return true;
  }

  async bulkUpdate(
    updates: BulkUpdateProductDto[],
  ): Promise<{ updatedCount: number }> {
    const ids = updates.map((u) => u.id);

    const products = await this.productsRepository.find({
      where: { id: In(ids), isDeleted: false },
    });

    if (products.length === 0) {
      throw new NotFoundException('Ningun producto encontrado para actualizar');
    }

    const updatedProducts: Product[] = [];

    for (const update of updates) {
      const product = products.find((p) => p.id === update.id);
      if (!product) continue;

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
