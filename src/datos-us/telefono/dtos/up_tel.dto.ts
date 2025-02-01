import { PartialType } from "@nestjs/mapped-types";
import { CreateTelefonosDTO } from "./cr_tel.dto";

export class UpTelDto extends PartialType(CreateTelefonosDTO) {}