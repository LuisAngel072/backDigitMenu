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
import { OpcionesService } from './opciones.service';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CrOpcionesDto } from './dtos/cr-opciones.dto';
import { UpOpcionesDto } from './dtos/up-opciones.dto';
import { Opciones } from './entities/opciones.entity';

@Controller('opciones')
export class OpcionesController {
  constructor(private readonly opcionesService: OpcionesService) {}

  @Get()
  async getOpciones() {
    return await this.opcionesService.getOpciones();
  }

  @Get()
  async getOpcion(@Param('id_opcion', ParseIntPipe) id_opcion: number) {
    return await this.opcionesService.getOpcion(id_opcion);
  }

  @Auth(Roles_validos.admin)
  @Post('registrar')
  async crOpcion(@Body() crOpcionesDto: CrOpcionesDto): Promise<Opciones> {
    console.log(crOpcionesDto);
    return await this.opcionesService.crOpcion(crOpcionesDto);
  }

  @Auth(Roles_validos.admin)
  @Patch('actualizar/:id_opcion')
  async upExtra(
    @Param('id_opcion', ParseIntPipe) id_opcion: number,
    @Body() upOpcionesDto: UpOpcionesDto,
  ) {
    return await this.opcionesService.upOpcion(id_opcion, upOpcionesDto);
  }

  @Auth(Roles_validos.admin)
  @Delete('eliminar/:id_opcion')
  async delExtra(@Param('id_opcion', ParseIntPipe) id_opcion: number) {
    return await this.opcionesService.delOpcion(id_opcion);
  }
}
