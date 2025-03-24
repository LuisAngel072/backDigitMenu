import { PartialType } from "@nestjs/mapped-types";
import { RFC } from "../entities/rfc.entity";

export class UpRFCDTO extends PartialType(RFC) {}