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
import { CrearIngredienteDTO } from './dtos/create-ingrediente.dto';
import { IngredientesService } from './ingredientes.service';
import { UpIngredienteDTO } from './dtos/up-ingrediente.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';

@Controller('ingredientes')
export class IngredientesController {
  constructor(private readonly ingredientesService: IngredientesService) {}

  @Get()
  async obtenerIngredientes() {
    return await this.ingredientesService.obtenerIngredientes();
  }

  @Auth(Roles_validos.admin)
  @Post('registrar')
  async registrarIngrediente(@Body() body: CrearIngredienteDTO) {
    return await this.ingredientesService.crearIngrediente(body);
  }
  @Auth(Roles_validos.admin)
  @Patch('actualizar/:id_ingr')
  async actualizarIngrediente(
    @Param('id_ingr', ParseIntPipe) id_ingr: number,
    @Body() body: UpIngredienteDTO,
  ) {
    return await this.ingredientesService.updtIngrediente(id_ingr, body);
  }

  @Auth(Roles_validos.admin)
  @Delete('eliminar/:id_ingr')
  async eliminarUsuario(@Param('id_ingr', ParseIntPipe) id_ingr: number) {
    return await this.ingredientesService.delIngr(id_ingr);
  }
}
