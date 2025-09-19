// src/departments/departments.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';

@Controller('api/departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentsService.findOne(+id);
  }

  @Post()
  create(@Body() department: Department): Promise<Department> {
    return this.departmentsService.create(department);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() department: Partial<Department>,
  ): Promise<Department> {
    return this.departmentsService.update(+id, department);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(+id);
  }
}
