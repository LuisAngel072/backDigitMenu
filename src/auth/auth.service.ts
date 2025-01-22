import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService,
      ) {}

      async validarUsuario(codigo: string, contrasena: string) {
        const usuario = await this.usuariosService.encontrarUnUsuario(codigo);
      
        if (usuario) {
          const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena); // Usa solo compare
          console.log('Contraseña válida:', contrasenaValida); // Asegúrate de que este log funcione
          if (contrasenaValida) {
            const { contrasena, ...result } = usuario; // Excluye la contraseña del objeto de retorno
            return result;
          }
        }
      
        // Si no se cumple ninguna de las condiciones, lanza la excepción
        throw new UnauthorizedException('Credenciales inválidas');
      }
      

    async iniciarSesion(usuario: any) {
        const payload = { sub: usuario.id_usuario, rol: usuario.rol };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
}
