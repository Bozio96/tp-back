import { IsString, IsNotEmpty, ValidateIf } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ValidateIf(o => !o.cuil)
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ValidateIf(o => !o.dni)
  @IsString()
  @IsNotEmpty()
  cuil: string;


  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  domicilio: string;
}
