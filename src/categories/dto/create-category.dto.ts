import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronica' })
  @IsString()
  @Length(1, 255)
  name: string;
}
