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

  @Get()
  async obtenerProductos() {
    return await this.productosService.obtenerProductos();
  }

  @Get(':id_producto')
  async obtenerProducto(
    @Param('id_producto', ParseIntPipe) id_producto: number,
  ) {
    return await this.productosService.obtenerProducto(id_producto);
  }

  @Get('extras/:id_producto')
  async obtenerExtrasDeProducto(
    @Param('id_producto', ParseIntPipe) id_producto: number,
  ) {
    return await this.productosService.obtenerExtrasDeProducto(id_producto);
  }

  @Get('ingredientes/:id_producto')
  async obtenerIngredientesDeProducto(
    @Param('id_producto', ParseIntPipe) id_producto: number,
  ) {
    return await this.productosService.obtenerIngredientesDeProducto(
      id_producto,
    );
  }

  @Get('opciones/:id_producto')
  async obtenerOpcionesDeProducto(
    @Param('id_producto', ParseIntPipe) id_producto: number,
  ) {
    return await this.productosService.obtenerOpcionesDeProducto(id_producto);
  }

  @Auth(Roles_validos.admin)
  @Post('registrar')
  async crearProducto(@Body() prodDTO: CrProductosDto) {
    return await this.productosService.crearProducto(prodDTO);
  }

  @Auth(Roles_validos.admin)
  @Patch('actualizar/:id_producto')
  async actualizarProducto(
    @Param('id_producto', ParseIntPipe) id_producto: number,
    prodDTO: UpProductosDto,
  ) {
    return await this.productosService.upProducto(id_producto, prodDTO);
  }

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