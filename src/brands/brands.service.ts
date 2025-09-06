// src/brands/brands.service.ts
import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  findAll() {
    return this.brandsRepository.find();
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandsRepository.findOneBy({ id });
    if (!brand) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }
    return brand;
  }

  async create(brand: any): Promise<Brand> {
    // Validar: no permitir nombre duplicado
    const existing = await this.brandsRepository.findOneBy({ name: brand.name });
    if (existing) {
      throw new ConflictException(`Ya existe una marca con el nombre "${brand.name}"`);
    }
    return this.brandsRepository.save(brand);
  }

  async update(id: number, brand: any): Promise<Brand> {
    const existing = await this.brandsRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }

    // Validar: si el nombre cambia, verificar que no esté duplicado
    if (brand.name && brand.name !== existing.name) {
      const duplicate = await this.brandsRepository.findOneBy({ name: brand.name });
      if (duplicate) {
        throw new ConflictException(`Ya existe una marca con el nombre "${brand.name}"`);
      }
    }

    await this.brandsRepository.update(id, brand);

    const updatedBrand = await this.brandsRepository.findOneBy({ id });
    if (!updatedBrand) {
      throw new InternalServerErrorException('Error al recuperar la marca actualizada');
    }

    return updatedBrand;
  }

  remove(id: number) {
    return this.brandsRepository.delete(id);
  }
}