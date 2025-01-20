import { IsString, MaxLength } from "class-validator";

export class CreateRFCDTO {
    @IsString()
    @MaxLength(13,{message: 'Se superó el limite de 13 caracteres en rfc'})
    rfc:string;
}