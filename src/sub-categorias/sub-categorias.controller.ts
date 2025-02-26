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
import { SubCategoriasService } from './sub-categorias.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';
import { CrSubCategoriasDTO } from './dtos/cr-sub_cat.dto';
import { UpSubCatDTO } from './dtos/up-sub_cat.dto';

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

  @Get()
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

  @Patch('editar')
  @Auth(Roles_validos.admin)
  async editarSubcategoria(
    @Param('id_subcat', ParseIntPipe) id_subcat: number,
    @Body() upSubCatDTO: UpSubCatDTO,
  ) {
    return await this.subCatService.upSubCat(id_subcat, upSubCatDTO);
  }

  @Delete('eliminar')
  @Auth(Roles_validos.admin)
  async eliminarSubcategoria(
    @Param('id_subcat', ParseIntPipe) id_subcat: number,
  ) {
    return await this.subCatService.delSubCat(id_subcat);
  }
}
