import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthService {
    constructor(private usuariosService: UsuariosService){}

    async iniciarSesion(codigo: string, con: string): Promise<any> {
        const usuario = await this.usuariosService.encontrarUnUsuario(codigo);

        if (usuario?.contrasena !== con) {
            throw new UnauthorizedException();
        }
        const { contrasena, ...result } = usuario;
        return result;
    }
}
