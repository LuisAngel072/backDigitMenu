import { PartialType } from "@nestjs/mapped-types";
import { CreateNSSDTO } from "./cr-nss.dto";

export class UpNssDto extends PartialType(CreateNSSDTO) {}
