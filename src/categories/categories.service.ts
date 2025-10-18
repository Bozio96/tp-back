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
    return this.categoriesRepository.find({
      where: { isDeleted: false },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!category) {
      throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existing) {
      if (!existing.isDeleted) {
        throw new ConflictException(
          `Ya existe una Categoria con el nombre "${createCategoryDto.name}"`,
        );
      }

      const revived = this.categoriesRepository.merge(existing, {
        isDeleted: false,
        name: createCategoryDto.name,
      });
      return this.categoriesRepository.save(revived);
    }

    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      isDeleted: false,
    });
    return this.categoriesRepository.save(category);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const existing = await this.categoriesRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!existing) {
      throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
    }

    if (updateCategoryDto.name && updateCategoryDto.name !== existing.name) {
      const duplicate = await this.categoriesRepository.findOne({
        where: { name: updateCategoryDto.name, isDeleted: false },
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
    const category = await this.categoriesRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!category) {
      throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
    }

    category.isDeleted = true;
    await this.categoriesRepository.save(category);
    return { success: true };
  }
}
