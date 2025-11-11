// src/departments/departments.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { DepartmentsService } from './departments.service';

@ApiTags('departments')
@ApiBearerAuth()
@Controller('api/departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar departamentos' })
  findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener departamento por id' })
  findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear departamento' })
  create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar departamento' })
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentsService.update(+id, updateDepartmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar departamento' })
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(+id);
  }
}
