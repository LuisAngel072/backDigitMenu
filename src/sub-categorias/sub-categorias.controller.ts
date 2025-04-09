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
import { SubCategoriasService } from './sub-categorias.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';
import { CrSubCategoriasDTO } from './dtos/cr-sub_cat.dto';
import { UpSubCatDTO } from './dtos/up-sub_cat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('sub-categorias')
export class SubCategoriasController {
  constructor(private readonly subCatService: SubCategoriasService) {}

  @Get()
  @Auth(
    Roles_validos.admin,
    Roles_validos.cajero,
    Roles_validos.cocinero,
    Roles_validos.mesero,
  )
  async obtenerSubCategorias() {
    return await this.subCatService.getSubCategorias();
  }

  @Get(':id_subcat')
  @Auth(
    Roles_validos.admin,
    Roles_validos.cajero,
    Roles_validos.cocinero,
    Roles_validos.mesero,
  )
  async obtenerSubCategoria(
    @Param('id_subcat', ParseIntPipe) id_subcat: number,
  ) {
    return await this.subCatService.getSubCategoria(id_subcat);
  }

  @Post('registrar')
  @Auth(Roles_validos.admin)
  async registarSubCategoria(@Body() subCatDto: CrSubCategoriasDTO) {
    return await this.subCatService.crSubCat(subCatDto);
  }

  @Patch('editar/:id_subcat')
  @Auth(Roles_validos.admin)
  async editarSubcategoria(
    @Param('id_subcat', ParseIntPipe) id_subcat: number,
    @Body() upSubCatDTO: UpSubCatDTO,
  ) {
    return await this.subCatService.upSubCat(id_subcat, upSubCatDTO);
  }

  @Delete('eliminar/:id_subcat')
  @Auth(Roles_validos.admin)
  async eliminarSubcategoria(
    @Param('id_subcat', ParseIntPipe) id_subcat: number,
  ) {
    return await this.subCatService.delSubCat(id_subcat);
  }

  @Post('subir-img_subcat')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/subcategorias',
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
