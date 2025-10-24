import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
    @ValidateIf(o => o.cuil === undefined)
    @IsString()
    @IsNotEmpty()
    dni?: string;

    @ValidateIf(o => o.dni === undefined)
    @IsString()
    @IsNotEmpty()
    cuil?: string;
}

