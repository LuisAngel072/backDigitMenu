import { Body, Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CrearCategoriaDto } from './dtos/crear-categoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  async obtenerCategorias() {
    return await this.categoriasService.obtenerCategorias();
  }

  @Post()
  async crearCategoria(@Body() data: CrearCategoriaDto) {
    return await this.categoriasService.crearCategoria(data);
  }

  @Patch(':id')
  async editarCategoria(@Param('id') id: number, @Body() data: CrearCategoriaDto) {
    return await this.categoriasService.editarCategoria(id, data);
  }

  @Delete(':id')
  async eliminarCategoria(@Param('id') id: number) {
    return await this.categoriasService.eliminarCategoria(id);
  }
}
