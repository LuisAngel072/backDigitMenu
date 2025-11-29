import { IsString, MaxLength } from 'class-validator';

export class CreateNSSDTO {
  @IsString()
  @MaxLength(11, { message: 'Se superó el limite de 11 caracteres en nss' })
  nss: string;
}
