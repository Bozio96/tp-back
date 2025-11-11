import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @ApiPropertyOptional({ example: 'Acme' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;
}
