import { IsNumber, IsString, Min } from 'class-validator';

export class CrExtrasDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre_extra: string;

  @IsNumber()
  @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
  precio: number;
}
