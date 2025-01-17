import { IsOptional, IsString, IsPostalCode, Length } from "class-validator";

export class CreateDomicilioDto {
    @IsString()
    calle: string;

    @IsString()
    colonia: string;

    @IsPostalCode('MX') // Asegura que sea un código postal válido (México)
    @Length(5, 5, { message: 'El código postal debe tener exactamente 5 caracteres.' })
    codigo_postal: string;

    @IsString()
    @Length(1, 5, { message: 'El número exterior debe tener entre 1 y 5 caracteres.' })
    no_ext: string;

    @IsString()
    @IsOptional()
    @Length(1, 5, { message: 'El número interior debe tener entre 1 y 5 caracteres.' })
    no_int: string;

    @IsString()
    municipio: string;
}
