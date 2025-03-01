import { PartialType } from "@nestjs/mapped-types";
import { CrExtrasDto } from "./cr-extra.dto";

export class UpExtrasDTO extends PartialType(CrExtrasDto) {}