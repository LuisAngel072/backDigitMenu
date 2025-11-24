import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailDto } from './cr-email.dto';

export class UpEmailDto extends PartialType(CreateEmailDto) {}
