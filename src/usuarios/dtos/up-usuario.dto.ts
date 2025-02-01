import { PartialType } from '@nestjs/mapped-types';
import { CrearUsuarioDto } from './crear-usuario.dto';
import { IsNumber } from 'class-validator';


export class UpUsuarioDto extends PartialType(CrearUsuarioDto) {}