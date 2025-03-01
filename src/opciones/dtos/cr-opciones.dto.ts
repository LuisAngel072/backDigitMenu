import { IsDecimal, IsString, Min } from "class-validator";

export class CrOpcionesDto {

    @IsString({message:'Debe ser un texto.'})
    nombre_opcion: string;

    @IsDecimal()
    @Min(0,{message: 'El porcentaje debe mayor a 0'})
    porcentaje: number;
}