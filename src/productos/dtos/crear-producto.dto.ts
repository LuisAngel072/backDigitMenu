import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Extras } from 'src/extras/entities/extras.entity';
import { Ingredientes } from 'src/ingredientes/entities/ingredientes.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';

export class CrProductosDto {
  @IsString()
  nombre_prod: string;
  @IsString()
  descripcion: string;
  @IsString()
  @IsOptional()
  img_prod?: string;
  @IsNumber()
  @Type(() => Number)
  precio: number;
  @IsNumber()
  sub_cat_id: number;
  @IsOptional()
  extras: Extras[];
  @IsOptional()
  opciones: Opciones[];
  @IsOptional()
  ingredientes: Ingredientes[];
}
