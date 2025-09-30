// src/suppliers/suppliers.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

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

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const existing = await this.suppliersRepository.findOneBy({
      name: createSupplierDto.name,
    });
    if (existing) {
      throw new ConflictException(
        `Ya existe un proveedor con el nombre "${createSupplierDto.name}"`,
      );
    }

    const supplier = this.suppliersRepository.create(createSupplierDto);
    return this.suppliersRepository.save(supplier);
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    const existing = await this.suppliersRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    if (updateSupplierDto.name && updateSupplierDto.name !== existing.name) {
      const duplicate = await this.suppliersRepository.findOneBy({
        name: updateSupplierDto.name,
      });
      if (duplicate) {
        throw new ConflictException(
          `Ya existe un proveedor con el nombre "${updateSupplierDto.name}"`,
        );
      }
    }

    const updatedSupplier = this.suppliersRepository.merge(
      existing,
      updateSupplierDto,
    );
    try {
      return await this.suppliersRepository.save(updatedSupplier);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al recuperar el proveedor actualizado',
      );
    }
  }

  async remove(id: number) {
    const supplier = await this.findOne(id);
    return this.suppliersRepository.remove(supplier);
  }
}
