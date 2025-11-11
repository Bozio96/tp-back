import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSaleItemSummaryDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  net: number;

  @ApiProperty({ example: 21 })
  @IsNumber()
  iva: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  discount: number;

  @ApiProperty({ example: 116 })
  @IsNumber()
  total: number;
}

export class CreateSaleItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  line: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  productId: number;

  @ApiProperty({ example: 'SKU-001' })
  @IsNotEmpty()
  internalCode: string;

  @ApiProperty({ example: 'Producto demo' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  @Max(100)
  discountRate: number;

  @ApiProperty({ example: 21 })
  @IsNumber()
  @Min(0)
  @Max(100)
  ivaRate: number;

  @ApiProperty({ type: CreateSaleItemSummaryDto })
  @ValidateNested()
  @Type(() => CreateSaleItemSummaryDto)
  summary: CreateSaleItemSummaryDto;
}
