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
import { ProductosService } from './productos.service';
import { CrProductosDto } from './dtos/crear-producto.dto';
import { UpProductosDto } from './dtos/up-producto.dto';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  /**
   * Obtiene todos los productos registrados en la base de datos.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: GET /productos
   * @returns Productos[]
   */
  @Get()
  async obtenerProductos() {
    return await this.productosService.obtenerProductos();
  }
  /**
   * Obtiene un producto específico por su ID.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: GET /productos/:id_producto
   * @param id_producto Id del producto a consultar
   * @returns Producto
   */
  @Get(':id_producto')
  async obtenerProducto(
    @Param('id_producto', ParseIntPipe) id_producto: number,
  ) {
    return await this.productosService.obtenerProducto(id_producto);
  }
  /**
   * Obtiene los extras asociados a un producto específico.
   * Esta es una API pública que no requiere autenticación
   * Ruta: GET productos/extras/:id_producto
   */
  @Get('extras/:id_producto')
  async obtenerExtrasDeProducto(
    @Param('id_producto', ParseIntPipe) id_producto: number,
  ) {
    return await this.productosService.obtenerExtrasDeProducto(id_producto);
  }
  /**
   * Obtiene los ingredientes asociados a un producto específico.
   * Esta es una API pública que no requiere autenticación
   * Ruta: GET productos/ingredientes/:id_producto
   */
  @Get('ingredientes/:id_producto')
  async obtenerIngredientesDeProducto(
    @Param('id_producto', ParseIntPipe) id_producto: number,
  ) {
    return await this.productosService.obtenerIngredientesDeProducto(
      id_producto,
    );
  }
  /**
   * Obtiene las opciones asociadas a un producto específico.
   * Esta es una API pública que no requiere autenticación
   * Ruta: GET productos/opciones/:id_producto
   */
  @Get('opciones/:id_producto')
  async obtenerOpcionesDeProducto(
    @Param('id_producto', ParseIntPipe) id_producto: number,
  ) {
    return await this.productosService.obtenerOpcionesDeProducto(id_producto);
  }

  /**
   * Crea un nuevo producto en la base de datos.
   * Esta API está protegida y solo los usuarios con rol de 'Admin' pueden acceder a ella.
   * Ruta: POST /productos/registrar
   * Lleva el decorador @Auth con el rol de 'Admin' para restringir el acceso.
   * @param prodDTO DTO para crear un nuevo producto
   * @returns Producto creado
   */
  @Auth(Roles_validos.admin)
  @Post('registrar')
  async crearProducto(@Body() prodDTO: CrProductosDto) {
    return await this.productosService.crearProducto(prodDTO);
  }
  /**
   * Actualiza un producto existente en la base de datos.
   * Esta API está protegida y solo los usuarios con rol de 'Admin' pueden acceder a ella.
   * Ruta: POST /productos/actualizar/:id_producto
   * Lleva el decorador @Auth con el rol de 'Admin' para restringir el acceso.
   */
  @Auth(Roles_validos.admin)
  @Patch('actualizar/:id_producto')
  async actualizarProducto(
    @Param('id_producto', ParseIntPipe) id_producto: number,
    @Body() prodDTO: UpProductosDto,
  ) {
    return await this.productosService.upProducto(id_producto, prodDTO);
  }
  /**
   * Elimina un producto de la BD.
   * Debe también eliminar todas sus relaciones M:M
   * @param id_producto id del producto a eliminar
   * @returns Producto eliminado
   */
  @Auth(Roles_validos.admin)
  @Delete('eliminar/:id_producto')
  async eliminarProducto(
    @Param('id_producto', ParseIntPipe) id_producto: number,
  ) {
    return await this.productosService.delProducto(id_producto);
  }

  @Post('subir-img_prod')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/productos',
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
