import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * Api para acceder al sistema, valida las credenciales y retorna un token JWT
   * @param body codigo y contrasena del usuario
   * @returns JWT token o error 401
   */
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
