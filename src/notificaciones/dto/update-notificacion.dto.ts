// src/notificaciones/dto/update-notificacion.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateNotificacionDto {
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  encargado_por?: number;
}
