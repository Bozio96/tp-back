import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RelationIdDto {
  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  id: number;
}

export class CreateProductDto {
  @ApiProperty({ example: 'SKU-100' })
  @IsString()
  @Length(1, 50)
  sku: string;

  @ApiProperty({ example: 'Mouse optico' })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({ example: 1500.5 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({ example: 25 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minStock: number;

  @ApiProperty({ example: 1000 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costBase: number;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discounts: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  includeIVA: boolean;

  @ApiProperty({ example: 35 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000)
  utilityPercentage: number;

  @ApiProperty({ example: 1900 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salePrice: number;

  @ApiProperty({ type: RelationIdDto })
  @ValidateNested()
  @Type(() => RelationIdDto)
  @IsDefined()
  brand: RelationIdDto;

  @ApiProperty({ type: RelationIdDto })
  @ValidateNested()
  @Type(() => RelationIdDto)
  @IsDefined()
  category: RelationIdDto;

  @ApiProperty({ type: RelationIdDto })
  @ValidateNested()
  @Type(() => RelationIdDto)
  @IsDefined()
  supplier: RelationIdDto;

  @ApiProperty({ type: RelationIdDto })
  @ValidateNested()
  @Type(() => RelationIdDto)
  @IsDefined()
  department: RelationIdDto;
}
