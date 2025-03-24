import { PartialType } from '@nestjs/mapped-types';
import { CrSubCategoriasDTO } from './cr-sub_cat.dto';

export class UpSubCatDTO extends PartialType(CrSubCategoriasDTO) {}
