import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateNotificacionDto {
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsNumber()
  encargado_por?: number;
}
