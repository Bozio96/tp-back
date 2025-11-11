import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'Acme' })
  @IsString()
  @Length(1, 255)
  name: string;
}
