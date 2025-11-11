import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Ventas' })
  @IsString()
  @Length(1, 255)
  name: string;
}
