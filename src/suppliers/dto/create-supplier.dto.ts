import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ example: 'Proveedor SA' })
  @IsString()
  @Length(1, 255)
  name: string;
}
