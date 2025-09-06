// src/suppliers/suppliers.service.ts
import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
  ) {}

  findAll() {
    return this.suppliersRepository.find();
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.suppliersRepository.findOneBy({ id });
    if (!supplier) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }
    return supplier;
  }

  async create(supplier: any): Promise<Supplier> {
    // Validar: no permitir nombre duplicado
    const existing = await this.suppliersRepository.findOneBy({ name: supplier.name });
    if (existing) {
      throw new ConflictException(`Ya existe un proveedor con el nombre "${supplier.name}"`);
    }
    return this.suppliersRepository.save(supplier);
  }

  async update(id: number, supplier: any): Promise<Supplier> {
    const existing = await this.suppliersRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    // Validar: si el nombre cambia, verificar que no esté duplicado
    if (supplier.name && supplier.name !== existing.name) {
      const duplicate = await this.suppliersRepository.findOneBy({ name: supplier.name });
      if (duplicate) {
        throw new ConflictException(`Ya existe un proveedor con el nombre "${supplier.name}"`);
      }
    }

    await this.suppliersRepository.update(id, supplier);

    const updatedSupplier = await this.suppliersRepository.findOneBy({ id });
    if (!updatedSupplier) {
      throw new InternalServerErrorException('Error al recuperar el proveedor actualizado');
    }

    return updatedSupplier;
  }

  remove(id: number) {
    return this.suppliersRepository.delete(id);
  }
}