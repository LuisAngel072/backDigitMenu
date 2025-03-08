import { Body, Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { SubcategoriasService } from './subcategorias.service';
import { CrearSubcategoriaDto } from './dtos/crear-subcategoria.dto';

@Controller('subcategorias')
export class SubcategoriasController {
  constructor(private readonly subcategoriasService: SubcategoriasService) {}

  @Get()
  async obtenerSubcategorias() {
    return await this.subcategoriasService.obtenerSubcategorias();
  }

  @Post()
  async crearSubcategoria(@Body() data: CrearSubcategoriaDto) {
    return await this.subcategoriasService.crearSubcategoria(data);
  }

  @Patch(':id')
  async editarSubcategoria(@Param('id') id: number, @Body() data: CrearSubcategoriaDto) {
    return await this.subcategoriasService.editarSubcategoria(id, data);
  }

  @Delete(':id')
  async eliminarSubcategoria(@Param('id') id: number) {
    return await this.subcategoriasService.eliminarSubcategoria(id);
  }
}
