import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, Length } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;
}
