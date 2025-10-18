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
    return this.brandsRepository.find({
      where: { isDeleted: false },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandsRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!brand) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }
    return brand;
  }

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const existing = await this.brandsRepository.findOne({
      where: { name: createBrandDto.name },
    });

    if (existing) {
      if (!existing.isDeleted) {
        throw new ConflictException(
          `Ya existe una marca con el nombre "${createBrandDto.name}"`,
        );
      }

      const revived = this.brandsRepository.merge(existing, {
        isDeleted: false,
        name: createBrandDto.name,
      });
      return this.brandsRepository.save(revived);
    }

    const brand = this.brandsRepository.create({
      ...createBrandDto,
      isDeleted: false,
    });
    return this.brandsRepository.save(brand);
  }

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const existing = await this.brandsRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!existing) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }

    if (updateBrandDto.name && updateBrandDto.name !== existing.name) {
      const duplicate = await this.brandsRepository.findOne({
        where: { name: updateBrandDto.name, isDeleted: false },
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
    const brand = await this.brandsRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!brand) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }

    brand.isDeleted = true;
    await this.brandsRepository.save(brand);
    return { success: true };
  }
}
