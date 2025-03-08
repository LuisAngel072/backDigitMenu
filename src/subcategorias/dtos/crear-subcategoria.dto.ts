// DTO: crear-subcategoria.dto.ts
import { IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { Categorias } from 'src/categorias/entities/categorias.entity';

export class CrearSubcategoriaDto {
  @IsString()
  @MaxLength(100)
  nombre_subcat: string;

  @IsNotEmpty()
  categoria: Categorias;
}