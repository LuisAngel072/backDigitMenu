import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CrearCategoriaDTO } from './dtos/cr-categoria.dto';
import { UpCategoriasDto } from './dtos/up-categorias.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly catService: CategoriasService) {}

  @Get()
  async obtenerCategorias() {
    return await this.catService.getCategorias();
  }

  @Get(':id_cat')
  async obtenerCategoria(@Param('id_cat', ParseIntPipe) id_cat: number) {
    return await this.catService.getCategoria(id_cat);
  }

  @Post('registrar')
  @Auth(Roles_validos.admin)
  async registrarCategoria(@Body() catDto: CrearCategoriaDTO) {
    return await this.catService.crCategoria(catDto);
  }

  @Patch('actualizar/:id_cat')
  @Auth(Roles_validos.admin)
  async actualizarCategoria(
    @Param('id_cat', ParseIntPipe) id_cat: number,
    @Body() upCatDto: UpCategoriasDto,
  ) {
    return await this.catService.upCategoria(id_cat, upCatDto);
  }

  @Delete('eliminar/:id_cat')
  @Auth(Roles_validos.admin)
  async eliminarCategoria(@Param('id_cat', ParseIntPipe) id_cat: number) {
    return await this.catService.delCategoria(id_cat);
  }

  @Post('subir-img_cat')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/categorias',
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
    return { ruta_img: file.filename };
  }
}
