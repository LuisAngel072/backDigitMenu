import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Email } from 'src/datos-us/email/entities/email.entity';
import { Telefonos } from 'src/datos-us/telefono/entities/telefono.entity';
import { SexoEnum } from '../entities/usuarios.entity';
import { Domicilios } from 'src/datos-us/domicilio/entities/domicilio.entity';
import { Roles } from 'src/datos-us/roles/entities/roles.entity';
import { NSS } from 'src/datos-us/nss/entities/nss.entity';
import { RFC } from 'src/datos-us/rfc/entities/rfc.entity';

export class CrearUsuarioDto {

    @IsString()
    codigo: string;

    @IsString()
    nombres: string;

    @IsString()
    primer_apellido: string;

    @IsString()
    @IsOptional()
    segundo_apellido: string;

    @IsNotEmpty()
    telefono: string;

    @IsNotEmpty()
    email: Email;

    @IsEnum(SexoEnum)
    sexo:string;

    @IsString()
    @IsOptional()
    @MaxLength(13,{message: 'Se superó el limite de 13 caracteres en rfc'})
    rfc:string;

    @IsString()
    @IsOptional()
    @MaxLength(11,{message: 'Se superó el limite de 11 caracteres en nss'})
    nss:string;

    @IsNotEmpty()
    domicilio: Domicilios;

    //Pondria IsHash('SHA256') pero no detecta el hash y ocasiona errores
    @IsNotEmpty()
    contrasena:string;

    @IsOptional()
    @IsString()
    img_perfil: string;

    @IsArray()
    rol: Roles[];

}