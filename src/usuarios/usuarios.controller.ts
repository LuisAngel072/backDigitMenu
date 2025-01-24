import { Body, Controller, Get, Post } from '@nestjs/common';
import { CrearUsuarioDto } from './dtos/crear-usuario.dto';
import { UsuariosService } from './usuarios.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}
    
    
    @Auth(Roles_validos.admin)
    @Get()
    async encontrarUsuarios() {
      return await this.usuariosService.encontrarUsuarios();
    }

    @Auth(Roles_validos.admin)
    @Post('registro')
    async registrarUsuario(@Body() usuario: CrearUsuarioDto) {
      return await this.usuariosService.CrearUsuario(usuario);
    }
}
