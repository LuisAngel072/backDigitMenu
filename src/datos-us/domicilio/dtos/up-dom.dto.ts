import { PartialType } from "@nestjs/mapped-types";
import { CreateDomicilioDto } from "./cr-dom.dto";

export class UpDomDto extends PartialType(CreateDomicilioDto) {}
