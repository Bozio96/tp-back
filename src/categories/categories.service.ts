// src/categories/categories.service.ts
import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

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
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return category;
  }

  async create(category: any): Promise<Category> {
    // Validar: no permitir nombre duplicado
    const existing = await this.categoriesRepository.findOneBy({ name: category.name });
    if (existing) {
      throw new ConflictException(`Ya existe una categoría con el nombre "${category.name}"`);
    }
    return this.categoriesRepository.save(category);
  }

  async update(id: number, category: any): Promise<Category> {
    const existing = await this.categoriesRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    // Validar: si el nombre cambia, verificar que no esté duplicado
    if (category.name && category.name !== existing.name) {
      const duplicate = await this.categoriesRepository.findOneBy({ name: category.name });
      if (duplicate) {
        throw new ConflictException(`Ya existe una categoría con el nombre "${category.name}"`);
      }
    }

    await this.categoriesRepository.update(id, category);

    const updatedCategory = await this.categoriesRepository.findOneBy({ id });
    if (!updatedCategory) {
      throw new InternalServerErrorException('Error al recuperar la categoría actualizada');
    }

    return updatedCategory;
  }

  remove(id: number) {
    return this.categoriesRepository.delete(id);
  }
}