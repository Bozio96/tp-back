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
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

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

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const existing = await this.departmentsRepository.findOneBy({
      name: createDepartmentDto.name,
    });
    if (existing) {
      throw new ConflictException(
        `Ya existe un departamento con el nombre "${createDepartmentDto.name}"`,
      );
    }

    const department = this.departmentsRepository.create(createDepartmentDto);
    return this.departmentsRepository.save(department);
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const existing = await this.departmentsRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Departamento con ID ${id} no encontrado`);
    }

    if (updateDepartmentDto.name && updateDepartmentDto.name !== existing.name) {
      const duplicate = await this.departmentsRepository.findOneBy({
        name: updateDepartmentDto.name,
      });
      if (duplicate) {
        throw new ConflictException(
          `Ya existe un departamento con el nombre "${updateDepartmentDto.name}"`,
        );
      }
    }

    const updatedDepartment = this.departmentsRepository.merge(
      existing,
      updateDepartmentDto,
    );
    try {
      return await this.departmentsRepository.save(updatedDepartment);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al recuperar el departamento actualizado',
      );
    }
  }

  async remove(id: number) {
    const department = await this.findOne(id);
    return this.departmentsRepository.remove(department);
  }
}
