// src/categories/categories.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findAll() {
    return this.categoriesRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoriesRepository.findOneBy({
      name: createCategoryDto.name,
    });
    if (existing) {
      throw new ConflictException(
        `Ya existe una Categoria con el nombre "${createCategoryDto.name}"`,
      );
    }

    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const existing = await this.categoriesRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
    }

    if (updateCategoryDto.name && updateCategoryDto.name !== existing.name) {
      const duplicate = await this.categoriesRepository.findOneBy({
        name: updateCategoryDto.name,
      });
      if (duplicate) {
        throw new ConflictException(
          `Ya existe una Categoria con el nombre "${updateCategoryDto.name}"`,
        );
      }
    }

    const updatedCategory = this.categoriesRepository.merge(
      existing,
      updateCategoryDto,
    );
    try {
      return await this.categoriesRepository.save(updatedCategory);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al recuperar la Categoria actualizada',
      );
    }
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    return this.categoriesRepository.remove(category);
  }
}
