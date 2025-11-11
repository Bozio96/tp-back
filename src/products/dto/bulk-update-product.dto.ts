import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// src/products/dto/bulk-update-product.dto.ts
export class BulkUpdateProductDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;

  // Campos opcionales: solo se actualizan si vienen presentes
  @ApiPropertyOptional({ example: 1200.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costBase?: number;

  @ApiPropertyOptional({ example: 1650 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salePrice?: number;

  @ApiPropertyOptional({ example: 32 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000)
  utilityPercentage?: number;
}
