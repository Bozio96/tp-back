import { IsString, Length } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @Length(1, 255)
  name: string;
}
