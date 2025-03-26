import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { RolesService } from 'src/datos-us/roles/roles.service';
@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly rolesService: RolesService,
        private readonly jwtService: JwtService,
      ) {}

      async validarUsuario(codigo: string, contrasena: string) {
        const usuario = await this.usuariosService.encontrarUnUsuario(codigo);
      
        if (usuario.activo) {

          const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena); // Usa solo compare
          console.log('Contraseña válida:', contrasenaValida); // Asegúrate de que este log funcione

          // Recuperar el rol asociado al usuario desde la relación
          const roles = await this.rolesService.getRolesByUsuario(usuario);
          if (!roles || roles.length === 0) {
            throw new UnauthorizedException('No se encontraron roles asociados al usuario');
          }

          if (contrasenaValida) {
            const { contrasena, ...result } = usuario; // Excluye la contraseña del objeto de retorno
            return result;
          } 
        }
      
        // Si no se cumple ninguna de las condiciones, lanza la excepción
        throw new UnauthorizedException('Credenciales inválidas');
      }
      

    async iniciarSesion(usuario: any) {
      const roles = await this.rolesService.getRolesByUsuario(usuario);
      const rol = roles[0].rol;
      const payload = {
        sub: usuario.id_usuario,
        rol: rol,
        nombres: usuario.nombres,
        codigo: usuario.codigo,
        primer_apellido: usuario.primer_apellido,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
      }
}
