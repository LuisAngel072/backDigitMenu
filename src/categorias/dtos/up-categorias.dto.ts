import { PartialType } from '@nestjs/mapped-types';
import { CrearCategoriaDTO } from './cr-categoria.dto';

export class UpCategoriasDto extends PartialType(CrearCategoriaDTO) {}
