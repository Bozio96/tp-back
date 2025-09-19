// src/departments/departments.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
  ) {}

  findAll() {
    return this.departmentsRepository.find();
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentsRepository.findOneBy({ id });
    if (!department) {
      throw new NotFoundException(`Departamento con ID ${id} no encontrado`);
    }
    return department;
  }

  async create(department: any): Promise<Department> {
    // Validar: no permitir nombre duplicado
    const existing = await this.departmentsRepository.findOneBy({
      name: department.name,
    });
    if (existing) {
      throw new ConflictException(
        `Ya existe un departamento con el nombre "${department.name}"`,
      );
    }
    return this.departmentsRepository.save(department);
  }

  async update(id: number, department: any): Promise<Department> {
    const existing = await this.departmentsRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Departamento con ID ${id} no encontrado`);
    }

    // Validar: si el nombre cambia, verificar que no esté duplicado
    if (department.name && department.name !== existing.name) {
      const duplicate = await this.departmentsRepository.findOneBy({
        name: department.name,
      });
      if (duplicate) {
        throw new ConflictException(
          `Ya existe un departamento con el nombre "${department.name}"`,
        );
      }
    }

    await this.departmentsRepository.update(id, department);

    const updatedDepartment = await this.departmentsRepository.findOneBy({
      id,
    });
    if (!updatedDepartment) {
      throw new InternalServerErrorException(
        'Error al recuperar el departamento actualizado',
      );
    }

    return updatedDepartment;
  }

  remove(id: number) {
    return this.departmentsRepository.delete(id);
  }
}
