import { PartialType } from '@nestjs/mapped-types';
import { CrOpcionesDto } from './cr-opciones.dto';

export class UpOpcionesDto extends PartialType(CrOpcionesDto) {}
