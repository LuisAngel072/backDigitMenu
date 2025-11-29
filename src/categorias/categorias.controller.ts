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
import { Categorias } from './entities/categorias.entity';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly catService: CategoriasService) {}

  /**
   * Obtiene todas las categorías disponibles en la base de datos.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: GET /categorias
   * @returns Categorias[]
   */
  @Get()
  async obtenerCategorias(): Promise<Categorias[]> {
    return await this.catService.getCategorias();
  }
  /**
   * Obtiene una categoría específica por su ID.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: GET /categorias/:id_cat
   * @param id_cat Id de la categoria especifica a consultar
   * @returns Categorias
   */
  @Get(':id_cat')
  async obtenerCategoria(
    @Param('id_cat', ParseIntPipe) id_cat: number,
  ): Promise<Categorias> {
    return await this.catService.getCategoria(id_cat);
  }

  /**
   * Registra una nueva categoría en la base de datos.
   * Esta API está protegida y solo los usuarios con rol de 'Admin' pueden acceder a ella.
   * Ruta: POST /categorias/registrar
   * Lleva el decorador @Auth con el rol de 'Admin' para restringir el acceso.
   * Los datos ingresados deben cumplir con la estructura definida en CrearCategoriaDTO.
   * @param catDto Dto para crear categorias (Revisar carpeta de dtos para ver estructura)
   * @returns categoria creada Categorias
   */
  @Post('registrar')
  @Auth(Roles_validos.admin)
  async registrarCategoria(@Body() catDto: CrearCategoriaDTO) {
    return await this.catService.crCategoria(catDto);
  }
  /**
   * Actualiza una categoría existente en la base de datos.
   * Esta API está protegida y solo los usuarios con rol de 'Admin' pueden acceder a ella.
   * Ruta: PATCH /categorias/actualizar/:id_cat
   * Lleva el decorador @Auth con el rol de 'Admin' para restringir el acceso.
   * Los datos ingresados deben cumplir con la estructura definida en UpCategoriasDto.
   * @param id_cat id de la categoria a actualizar
   * @param upCatDto upCatDto es un Partial Type de CrearCategoriaDTO
   * @returns Categoria actualizada UpdateResult 204
   */
  @Patch('actualizar/:id_cat')
  @Auth(Roles_validos.admin)
  async actualizarCategoria(
    @Param('id_cat', ParseIntPipe) id_cat: number,
    @Body() upCatDto: UpCategoriasDto,
  ) {
    return await this.catService.upCategoria(id_cat, upCatDto);
  }
  /**
   * Elimina una categoría de la base de datos.
   * Esta API está protegida y solo los usuarios con rol de 'Admin' pueden acceder a ella.
   * Ruta: DELETE /categorias/eliminar/:id_cat
   * Lleva el decorador @Auth con el rol de 'Admin' para restringir el acceso.
   * @param id_cat Categoria a eliminar de la bd
   * @returns categoria eliminada
   */
  @Delete('eliminar/:id_cat')
  @Auth(Roles_validos.admin)
  async eliminarCategoria(@Param('id_cat', ParseIntPipe) id_cat: number) {
    return await this.catService.delCategoria(id_cat);
  }
  /**
   * Sube una imagen para una categoría y retorna la ruta donde se almacena.
   * Esta API está protegida y solo los usuarios con rol de 'Admin' pueden acceder a ella.
   * Ruta: POST /categorias/subir-img_cat
   * Lleva el decorador @Auth con el rol de 'Admin' para restringir el acceso.
   * @param file Archivo img de la categoria
   * @returns ruta del archivo img en la base de datos
   * (la base de datos almacena solo la ruta del archivo en el servidor)
   */
  @Auth(Roles_validos.admin)
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
