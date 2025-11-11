import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { CreateSupplierDto } from './create-supplier.dto';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {
  @ApiPropertyOptional({ example: 'Proveedor SA' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;
}
