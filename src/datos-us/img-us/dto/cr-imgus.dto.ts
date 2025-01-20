import { IsString } from "class-validator";

export class CreateImgUsDTO {
    @IsString()
    img_ruta: string;
}
