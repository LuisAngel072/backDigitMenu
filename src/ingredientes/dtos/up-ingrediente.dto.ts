import { PartialType } from "@nestjs/mapped-types";
import { CrearIngredienteDTO } from "./create-ingrediente.dto";


export class UpIngredienteDTO extends PartialType(CrearIngredienteDTO) {}