import { IsString } from 'class-validator';

export class CrLogDto {
  @IsString()
  usuario: string;
  @IsString()
  accion: string;
  @IsString()
  descripcion: string;
  @IsString()
  modulo: string;
}
