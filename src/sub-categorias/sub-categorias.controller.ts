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
import { CrSubCategoriasDTO } from './dtos/cr-sub_cat.dto';
import { UpSubCatDTO } from './dtos/up-sub_cat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('sub-categorias')
export class SubCategoriasController {
  constructor(private readonly subCatService: SubCategoriasService) {}

  /**
   * Obtiene una lista de todas las subcategorías.
   * Esta es una API pública que no requiere autenticación.
   * API: GET /sub-categorias
   * @returns Un arreglo de objetos de subcategorías.
   */
  @Get()
  async obtenerSubCategorias() {
    return await this.subCatService.getSubCategorias();
  }

  /**
   * Obtiene una subcategoría específica por su ID.
   * Esta es una API pública que no requiere autenticación.
   * API: GET /sub-categorias/:id_subcat
   * @param id_subcat El ID de la subcategoría a obtener.
   * @returns El objeto de la subcategoría solicitada.
   */
  @Get(':id_subcat')
  async obtenerSubCategoria(
    @Param('id_subcat', ParseIntPipe) id_subcat: number,
  ) {
    return await this.subCatService.getSubCategoria(id_subcat);
  }

  /**
   * Registra una nueva subcategoría en la base de datos.
   * Esta es una API pública que no requiere autenticación.
   * API: POST /sub-categorias/registrar
   * @param subCatDto DTO con la información para crear la nueva subcategoría.
   * @returns La nueva subcategoría creada.
   */
  @Post('registrar')
  async registarSubCategoria(@Body() subCatDto: CrSubCategoriasDTO) {
    return await this.subCatService.crSubCat(subCatDto);
  }

  /**
   * Edita una subcategoría existente.
   * Esta es una API pública que no requiere autenticación.
   * API: PATCH /sub-categorias/editar/:id_subcat
   * @param id_subcat El ID de la subcategoría a editar.
   * @param upSubCatDTO DTO con los datos para actualizar la subcategoría.
   * @returns La subcategoría actualizada.
   */
  @Patch('editar/:id_subcat')
  async editarSubcategoria(
    @Param('id_subcat', ParseIntPipe) id_subcat: number,
    @Body() upSubCatDTO: UpSubCatDTO,
  ) {
    return await this.subCatService.upSubCat(id_subcat, upSubCatDTO);
  }

  /**
   * Elimina una subcategoría específica por su ID.
   * Esta es una API pública que no requiere autenticación.
   * API: DELETE /sub-categorias/eliminar/:id_subcat
   * @param id_subcat El ID de la subcategoría a eliminar.
   * @returns Una confirmación de la eliminación.
   */
  @Delete('eliminar/:id_subcat')
  async eliminarSubcategoria(
    @Param('id_subcat', ParseIntPipe) id_subcat: number,
  ) {
    return await this.subCatService.delSubCat(id_subcat);
  }

  /**
   * Sube un archivo de imagen para una subcategoría.
   * Esta es una API pública que no requiere autenticación.
   * API: POST /sub-categorias/subir-img_subcat
   * @param file El archivo de imagen a subir.
   * @returns Un objeto que contiene la ruta del archivo guardado.
   */
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
    return { ruta_img: file.filename };
  }
}
