import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateSaleItemDto } from './create-sale-item.dto';

class SaleCustomerDto {
  @ApiProperty({ example: 'registered' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({ example: '12' })
  @IsOptional()
  @IsString()
  id?: string | null;

  @ApiPropertyOptional({ example: 'Juan Perez' })
  @IsOptional()
  @IsString()
  name?: string | null;

  @ApiPropertyOptional({ example: 'CUIT' })
  @IsOptional()
  @IsString()
  document?: string | null;

  @ApiPropertyOptional({ example: '20123456789' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/, {
    message: 'El CUIT debe contener 11 digitos',
  })
  cuit?: string | null;

  @ApiPropertyOptional({ example: '30123456' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, {
    message: 'El DNI debe contener 8 digitos',
  })
  dni?: string | null;

  @ApiPropertyOptional({ example: 'Av. Siempre Viva 742' })
  @IsOptional()
  @IsString()
  address?: string | null;

  @ApiPropertyOptional({ example: '+54 11 2222-3333' })
  @IsOptional()
  @IsString()
  phone?: string | null;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  withoutClient?: boolean;
}

class SaleTotalsDto {
  @ApiProperty({ example: 1000 })
  @IsNumber()
  net: number;

  @ApiProperty({ example: 210 })
  @IsNumber()
  iva: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  discounts: number;

  @ApiProperty({ example: 1160 })
  @IsNumber()
  final: number;
}

export class CreateSaleDto {
  @ApiProperty({ enum: ['sale', 'quote'], example: 'sale' })
  @IsIn(['sale', 'quote'])
  type: 'sale' | 'quote';

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  invoiceDate: string;

  @ApiPropertyOptional({ example: '0001-00000012' })
  @IsOptional()
  @IsString()
  invoiceNumber?: string | null;

  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  invoiceType: string;

  @ApiProperty({ example: 'cash' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  clientId?: number | null;

  @ApiProperty({ type: SaleCustomerDto })
  @ValidateNested()
  @Type(() => SaleCustomerDto)
  customer: SaleCustomerDto;

  @ApiProperty({ type: SaleTotalsDto })
  @ValidateNested()
  @Type(() => SaleTotalsDto)
  totals: SaleTotalsDto;

  @ApiProperty({ type: [CreateSaleItemDto], minItems: 1 })
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  @ArrayMinSize(1)
  items: CreateSaleItemDto[];
}
