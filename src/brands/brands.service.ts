// src/brands/brands.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

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

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const existing = await this.brandsRepository.findOneBy({
      name: createBrandDto.name,
    });
    if (existing) {
      throw new ConflictException(
        `Ya existe una marca con el nombre "${createBrandDto.name}"`,
      );
    }

    const brand = this.brandsRepository.create(createBrandDto);
    return this.brandsRepository.save(brand);
  }

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const existing = await this.brandsRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }

    if (updateBrandDto.name && updateBrandDto.name !== existing.name) {
      const duplicate = await this.brandsRepository.findOneBy({
        name: updateBrandDto.name,
      });
      if (duplicate) {
        throw new ConflictException(
          `Ya existe una marca con el nombre "${updateBrandDto.name}"`,
        );
      }
    }

    const updatedBrand = this.brandsRepository.merge(existing, updateBrandDto);
    try {
      return await this.brandsRepository.save(updatedBrand);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al recuperar la marca actualizada',
      );
    }
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    return this.brandsRepository.remove(brand);
  }
}
