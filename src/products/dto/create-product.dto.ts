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

export class RelationIdDto {
  @IsInt()
  @Min(1)
  id: number;
}

export class CreateProductDto {
  @IsString()
  @Length(1, 50)
  sku: string;

  @IsString()
  @Length(1, 255)
  name: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  minStock: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costBase: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discounts: number;

  @IsBoolean()
  includeIVA: boolean;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000)
  utilityPercentage: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salePrice: number;

  @ValidateNested()
  @Type(() => RelationIdDto)
  @IsDefined()
  brand: RelationIdDto;

  @ValidateNested()
  @Type(() => RelationIdDto)
  @IsDefined()
  category: RelationIdDto;

  @ValidateNested()
  @Type(() => RelationIdDto)
  @IsDefined()
  supplier: RelationIdDto;

  @ValidateNested()
  @Type(() => RelationIdDto)
  @IsDefined()
  department: RelationIdDto;
}
