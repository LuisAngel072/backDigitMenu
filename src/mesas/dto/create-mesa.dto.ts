// src/mesas/dto/create-mesa.dto.ts
import { IsNumber, IsString } from 'class-validator';

export class CreateMesaDto {
  @IsNumber()
  no_mesa: number;

  @IsString()
  qr_code_url: string;
}
