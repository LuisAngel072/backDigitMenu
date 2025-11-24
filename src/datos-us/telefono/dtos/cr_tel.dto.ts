import { IsString, MaxLength } from 'class-validator';

export class CreateTelefonosDTO {
  @IsString()
  @MaxLength(12, {
    message: 'El número de telefono no debe sobrepasar 12 dígitos',
  })
  telefono: string;
}
