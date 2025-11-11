import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  @ApiPropertyOptional({ example: 'Ventas' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;
}
