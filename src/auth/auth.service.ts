import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from 'src/datos-us/roles/roles.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida que el codigo y contrasena ingresados sean correctos y coincidan con un usuario activo
   * de la base de datos. Si es asi, retorna el usuario sin la contrasena.
   * @param codigo codigo del usuario ingresado en el login
   * @param contrasena contrasena ingresada en el login
   * @returns 201 or 401/403
   */
  async validarUsuario(codigo: string, contrasena: string) {
    const usuario = await this.usuariosService.encontrarUnUsuario(codigo);
    if (!usuario) {
      throw new HttpException(
        `El usuario con código ${codigo} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (usuario.activo) {
      const contrasenaValida = await bcrypt.compare(
        contrasena,
        usuario.contrasena,
      ); // Usa solo compare
      console.log('Contraseña válida:', contrasenaValida); // Asegúrate de que este log funcione

      // Recuperar el rol asociado al usuario desde la relación
      const roles = await this.rolesService.getRolesByUsuario(usuario);
      if (!roles || roles.length === 0) {
        throw new UnauthorizedException(
          'No se encontraron roles asociados al usuario',
        );
      }

      if (contrasenaValida) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { contrasena, ...result } = usuario; // Excluye la contraseña del objeto de retorno
        return result;
      }
    }

    // Si no se cumple ninguna de las condiciones, lanza la excepción
    throw new UnauthorizedException('Credenciales inválidas');
  }
  /**
   * Inicia sesion un usuario y genera un token JWT con su informacion
   * @param usuario usuario que va a ingresar sesion
   * @returns Token de acceso a las apis
   */
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
