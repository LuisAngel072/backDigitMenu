import { PartialType } from '@nestjs/mapped-types';
import { CreateImgUsDTO } from './cr-imgus.dto';

export class UpImgUsDTO extends PartialType(CreateImgUsDTO) {}
