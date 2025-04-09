import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CrSubCategoriasDTO {
  @IsString()
  @MaxLength(60)
  nombre_subcat: string;

  @IsOptional()
  @MaxLength(255)
  ruta_img: string;

  @IsNumber()
  @IsNotEmpty()
  //Voy a preferir consultar la categoria desde el back en lugar de que el front la mande
  categoria_id: number;
}
