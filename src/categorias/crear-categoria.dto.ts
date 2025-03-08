import { IsNotEmpty, IsString } from 'class-validator';

export class CrearCategoriaDto {
  @IsNotEmpty()
  @IsString()
  nombre_cat: string;
}
