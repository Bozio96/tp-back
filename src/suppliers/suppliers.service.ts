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
    return this.suppliersRepository.find({
      where: { isDeleted: false },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.suppliersRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!supplier) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }
    return supplier;
  }

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const existing = await this.suppliersRepository.findOne({
      where: { name: createSupplierDto.name },
    });

    if (existing) {
      if (!existing.isDeleted) {
        throw new ConflictException(
          `Ya existe un proveedor con el nombre "${createSupplierDto.name}"`,
        );
      }

      const revived = this.suppliersRepository.merge(existing, {
        isDeleted: false,
        name: createSupplierDto.name,
      });
      return this.suppliersRepository.save(revived);
    }

    const supplier = this.suppliersRepository.create({
      ...createSupplierDto,
      isDeleted: false,
    });
    return this.suppliersRepository.save(supplier);
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    const existing = await this.suppliersRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!existing) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    if (updateSupplierDto.name && updateSupplierDto.name !== existing.name) {
      const duplicate = await this.suppliersRepository.findOne({
        where: { name: updateSupplierDto.name, isDeleted: false },
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
    const supplier = await this.suppliersRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!supplier) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    supplier.isDeleted = true;
    await this.suppliersRepository.save(supplier);
    return { success: true };
  }
}
