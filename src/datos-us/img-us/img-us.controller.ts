import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';

/**
 * Controlador para la gestión de imágenes de usuario.
 * Proporciona un endpoint para subir imágenes, protegido por autenticación y autorización.
 */
@Auth(Roles_validos.admin)
@Controller('img-us')
export class ImgUsController {
  @Post('subir-img')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/img-us',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtName = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${fileExtName}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Aquí, puedes retornar el nombre del archivo o la ruta relativa
    return { img_ruta: file.filename };
  }
}
