import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CrearUsuarioDto } from './dtos/crear-usuario.dto';
import { UsuariosService } from './usuarios.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';
import { UpUsuarioDto } from './dtos/up-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Auth(Roles_validos.admin)
  @Get()
  async encontrarUsuarios() {
    return await this.usuariosService.encontrarUsuarios();
  }

  @Get('/:codigo')
  async encontrarUnUsuarios(@Param('codigo') codigo: string) {
    return await this.usuariosService.encontrarUnUsuario(codigo);
  }

  @Auth(Roles_validos.admin)
  @Post('registro')
  async registrarUsuario(@Body() usuario: CrearUsuarioDto) {
    return await this.usuariosService.CrearUsuario(usuario);
  }

  @Auth(Roles_validos.admin)
  @Patch('actualizar/:id_usuario')
  async actualizarUsuario(
    @Param('id_usuario', ParseIntPipe) id_usuario: number,
    @Body() UpUsDto: UpUsuarioDto,
  ) {
    return await this.usuariosService.actualizarUsuario(id_usuario, UpUsDto);
  }

  @Auth(Roles_validos.admin)
  @Patch('desactivar/:id_usuario')
  async desactivarUsuario(
    @Param('id_usuario', ParseIntPipe) id_usuario: number,
  ) {
    return await this.usuariosService.desactivarUsuario(id_usuario);
  }

  @Auth(Roles_validos.admin)
  @Patch('reactivar/:id_usuario')
  async reactivarUsuario(
    @Param('id_usuario', ParseIntPipe) id_usuario: number,
  ) {
    return await this.usuariosService.reactivarUsuario(id_usuario);
  }
}
