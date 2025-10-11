import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsDateString, IsNumber } from 'class-validator';
import { Matches } from 'class-validator';
import { CreateSaleItemDto } from './create-sale-item.dto';

class SaleCustomerDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsString()
  id?: string | null;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  document?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/, {
    message: 'El CUIT debe contener 11 digitos',
  })
  cuit?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, {
    message: 'El DNI debe contener 8 digitos',
  })
  dni?: string | null;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsBoolean()
  withoutClient?: boolean;
}

class SaleTotalsDto {
  @IsNumber()
  net: number;

  @IsNumber()
  iva: number;

  @IsNumber()
  discounts: number;

  @IsNumber()
  final: number;
}

export class CreateSaleDto {
  @IsIn(['sale', 'quote'])
  type: 'sale' | 'quote';

  @IsDateString()
  invoiceDate: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string | null;

  @IsString()
  @IsNotEmpty()
  invoiceType: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ValidateNested()
  @Type(() => SaleCustomerDto)
  customer: SaleCustomerDto;

  @ValidateNested()
  @Type(() => SaleTotalsDto)
  totals: SaleTotalsDto;

  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  @ArrayMinSize(1)
  items: CreateSaleItemDto[];
}
