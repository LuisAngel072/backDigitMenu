import { PartialType } from '@nestjs/mapped-types';
import { CrProductosDto } from './crear-producto.dto';

export class UpProductosDto extends PartialType(CrProductosDto) {}
