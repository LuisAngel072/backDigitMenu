import { IsDecimal, IsString, Min } from "class-validator";


export class CrearIngredienteDTO {

    @IsString({ message: 'El nombre del ingrediente debe ser un texto.' })
    nombre_ingrediente:string;

    @IsDecimal()
    @Min(0, { message: 'El precio debe ser mayor o igual a 0.' })
    number:number;
}