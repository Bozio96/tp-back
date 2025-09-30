import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, Length } from 'class-validator';
import { CreateSupplierDto } from './create-supplier.dto';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;
}
