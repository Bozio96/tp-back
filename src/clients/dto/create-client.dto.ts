import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Perez' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiPropertyOptional({
    example: '12345678',
    description: 'Requerido solo si no se envia CUIL',
  })
  @ValidateIf(o => !o.cuil)
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiPropertyOptional({
    example: '20123456789',
    description: 'Requerido solo si no se envia DNI',
  })
  @ValidateIf(o => !o.dni)
  @IsString()
  @IsNotEmpty()
  cuil: string;

  @ApiProperty({ example: '+54 11 2222-3333' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Av. Siempre Viva 742' })
  @IsString()
  @IsNotEmpty()
  domicilio: string;
}
