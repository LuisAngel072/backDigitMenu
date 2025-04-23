import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
      ) {}
    
      @Post('login')
      async login(@Body() body: { codigo: string; contrasena: string }) {
        const { codigo, contrasena } = body;
        const usuario = await this.authService.validarUsuario(codigo, contrasena);
        if (!usuario) {
          throw new UnauthorizedException('Credenciales inválidas');
        }
        return this.authService.iniciarSesion(usuario);
      }
}
