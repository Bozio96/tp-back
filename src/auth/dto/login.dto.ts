import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario.demo' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'ClaveSegura123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
