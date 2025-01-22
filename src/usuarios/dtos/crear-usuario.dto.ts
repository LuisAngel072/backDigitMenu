import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Email } from 'src/datos-us/email/entities/email.entity';
import { Telefonos } from 'src/datos-us/telefono/entities/telefono.entity';
import { SexoEnum } from '../entities/usuarios.entity';
import { Domicilios } from 'src/datos-us/domicilio/entities/domicilio.entity';
import { Roles } from 'src/datos-us/roles/entities/roles.entity';
import { NSS } from 'src/datos-us/nss/entities/nss.entity';
import { RFC } from 'src/datos-us/rfc/entities/rfc.entity';
import { Img_us } from 'src/datos-us/img-us/entities/img_us.entity';

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
    telefono_id: Telefonos;

    @IsNotEmpty()
    email_id: Email;

    @IsEnum(SexoEnum)
    sexo:string;

    @IsOptional()
    rfc:RFC;

    
    @IsOptional()
    nss:NSS;

    @IsNotEmpty()
    domicilio: Domicilios;

    //Pondria IsHash('SHA256') pero no detecta el hash y ocasiona errores
    @IsNotEmpty()
    contrasena:string;

    @IsOptional()
    @IsString()
    img_perfil: Img_us;

    @IsNotEmpty()
    rol: Roles[];

}