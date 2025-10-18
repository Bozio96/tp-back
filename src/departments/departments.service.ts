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
    return this.departmentsRepository.find({
      where: { isDeleted: false },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!department) {
      throw new NotFoundException(`Departamento con ID ${id} no encontrado`);
    }
    return department;
  }

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const existing = await this.departmentsRepository.findOne({
      where: { name: createDepartmentDto.name },
    });

    if (existing) {
      if (!existing.isDeleted) {
        throw new ConflictException(
          `Ya existe un departamento con el nombre "${createDepartmentDto.name}"`,
        );
      }

      const revived = this.departmentsRepository.merge(existing, {
        isDeleted: false,
        name: createDepartmentDto.name,
      });
      return this.departmentsRepository.save(revived);
    }

    const department = this.departmentsRepository.create({
      ...createDepartmentDto,
      isDeleted: false,
    });
    return this.departmentsRepository.save(department);
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const existing = await this.departmentsRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!existing) {
      throw new NotFoundException(`Departamento con ID ${id} no encontrado`);
    }

    if (updateDepartmentDto.name && updateDepartmentDto.name !== existing.name) {
      const duplicate = await this.departmentsRepository.findOne({
        where: { name: updateDepartmentDto.name, isDeleted: false },
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
    const department = await this.departmentsRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!department) {
      throw new NotFoundException(`Departamento con ID ${id} no encontrado`);
    }

    department.isDeleted = true;
    await this.departmentsRepository.save(department);
    return { success: true };
  }
}
