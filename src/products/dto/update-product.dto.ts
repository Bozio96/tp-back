import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProductDto, RelationIdDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({ example: 1550.75 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minStock?: number;

  @ApiPropertyOptional({ example: 1100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costBase?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discounts?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  includeIVA?: boolean;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000)
  utilityPercentage?: number;

  @ApiPropertyOptional({ example: 1850 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salePrice?: number;

  @ApiPropertyOptional({ type: RelationIdDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RelationIdDto)
  brand?: RelationIdDto;

  @ApiPropertyOptional({ type: RelationIdDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RelationIdDto)
  category?: RelationIdDto;

  @ApiPropertyOptional({ type: RelationIdDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RelationIdDto)
  supplier?: RelationIdDto;

  @ApiPropertyOptional({ type: RelationIdDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RelationIdDto)
  department?: RelationIdDto;
}
