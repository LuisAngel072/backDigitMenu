import { Body, Controller, Post } from '@nestjs/common';
import { CrearUsuarioDto } from './dtos/crear-usuario.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @Post('registro')
  async registrarUsuario(@Body() usuario: CrearUsuarioDto) {
    return await this.usuariosService.CrearUsuario(usuario);
  }
}
