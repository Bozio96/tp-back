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

export class CreateSaleItemSummaryDto {
  @IsNumber()
  net: number;

  @IsNumber()
  iva: number;

  @IsNumber()
  discount: number;

  @IsNumber()
  total: number;
}

export class CreateSaleItemDto {
  @IsInt()
  line: number;

  @IsInt()
  productId: number;

  @IsNotEmpty()
  internalCode: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0.01)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  discountRate: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  ivaRate: number;

  @ValidateNested()
  @Type(() => CreateSaleItemSummaryDto)
  summary: CreateSaleItemSummaryDto;
}
