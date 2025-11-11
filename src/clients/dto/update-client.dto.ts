import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { CreateClientDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiPropertyOptional({
    example: '12345678',
    description: 'Requerido si no se envia CUIL',
  })
  @ValidateIf(o => o.cuil === undefined)
  @IsString()
  @IsNotEmpty()
  dni?: string;

  @ApiPropertyOptional({
    example: '20123456789',
    description: 'Requerido si no se envia DNI',
  })
  @ValidateIf(o => o.dni === undefined)
  @IsString()
  @IsNotEmpty()
  cuil?: string;
}
