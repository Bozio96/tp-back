import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

// src/products/dto/bulk-update-product.dto.ts
export class BulkUpdateProductDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;

  // Campos opcionales: solo se actualizan si vienen presentes
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costBase?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salePrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000)
  utilityPercentage?: number;
}