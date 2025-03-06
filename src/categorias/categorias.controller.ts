import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CrearCategoriaDTO } from './dtos/cr-categoria.dto';
import { UpCategoriasDto } from './dtos/up-categorias.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly catService: CategoriasService) {}

  @Get()
  @Auth(
    Roles_validos.admin,
    Roles_validos.cajero,
    Roles_validos.cocinero,
    Roles_validos.mesero,
  )
  async obtenerCategorias() {
    return await this.catService.getCategorias();
  }

  @Get(':id_cat')
  @Auth(
    Roles_validos.admin,
    Roles_validos.cajero,
    Roles_validos.cocinero,
    Roles_validos.mesero,
  )
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
    upCatDto: UpCategoriasDto,
  ) {
    return await this.catService.upCategoria(id_cat, upCatDto);
  }

  @Delete('eliminar/:id_cat')
  @Auth(Roles_validos.admin)
  async eliminarCategoria(@Param('id_cat', ParseIntPipe) id_cat: number) {
    return await this.catService.delCategoria(id_cat);
  }
}
