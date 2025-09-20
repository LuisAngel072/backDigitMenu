// src/notificaciones/dto/create-notificacion.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotificacionDto {
  @IsNotEmpty()
  @IsString()
  mensaje: string;

  @IsNotEmpty()
  @IsNumber()
  mesa_id: number;
}
