import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CrearCategoriaDTO {
  @IsString()
  @MaxLength(60)
  @IsNotEmpty()
  nombre_cat: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  ruta_img: string;
}
