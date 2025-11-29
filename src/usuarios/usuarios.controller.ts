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

  /**
   * Obtiene una lista de todos los usuarios del sistema.
   * Esta es una API privada, protegida por el rol de 'admin'.
   * API: GET /usuarios
   * @returns Un arreglo con todos los objetos de usuario.
   */
  @Auth(Roles_validos.admin)
  @Get()
  async encontrarUsuarios() {
    return await this.usuariosService.encontrarUsuarios();
  }

  /**
   * Encuentra un usuario específico por su código único.
   * Esta es una API pública que no requiere autenticación.
   * API: GET /usuarios/:codigo
   * @param codigo El código único del usuario a buscar.
   * @returns El objeto del usuario encontrado.
   */
  @Get('/:codigo')
  async encontrarUnUsuarios(@Param('codigo') codigo: string) {
    return await this.usuariosService.encontrarUnUsuario(codigo);
  }

  /**
   * Registra un nuevo usuario en la base de datos.
   * Esta es una API privada, protegida por el rol de 'admin'.
   * API: POST /usuarios/registro
   * @param usuario DTO con los datos para la creación del nuevo usuario.
   * @returns El nuevo usuario creado.
   */
  @Auth(Roles_validos.admin)
  @Post('registro')
  async registrarUsuario(@Body() usuario: CrearUsuarioDto) {
    return await this.usuariosService.CrearUsuario(usuario);
  }

  /**
   * Actualiza la información de un usuario existente.
   * Esta es una API privada, protegida por el rol de 'admin'.
   * API: PATCH /usuarios/actualizar/:id_usuario
   * @param id_usuario ID del usuario a actualizar.
   * @param UpUsDto DTO con los datos a actualizar.
   * @returns El usuario con su información actualizada.
   */
  @Auth(Roles_validos.admin)
  @Patch('actualizar/:id_usuario')
  async actualizarUsuario(
    @Param('id_usuario', ParseIntPipe) id_usuario: number,
    @Body() UpUsDto: UpUsuarioDto,
  ) {
    return await this.usuariosService.actualizarUsuario(id_usuario, UpUsDto);
  }

  /**
   * Desactiva la cuenta de un usuario, cambiando su estado a 'inactivo'.
   * Esta es una API privada, protegida por el rol de 'admin'.
   * API: PATCH /usuarios/desactivar/:id_usuario
   * @param id_usuario ID del usuario a desactivar.
   * @returns El usuario con el estado actualizado.
   */
  @Auth(Roles_validos.admin)
  @Patch('desactivar/:id_usuario')
  async desactivarUsuario(
    @Param('id_usuario', ParseIntPipe) id_usuario: number,
  ) {
    return await this.usuariosService.desactivarUsuario(id_usuario);
  }

  /**
   * Reactiva la cuenta de un usuario, cambiando su estado a 'activo'.
   * Esta es una API privada, protegida por el rol de 'admin'.
   * API: PATCH /usuarios/reactivar/:id_usuario
   * @param id_usuario ID del usuario a reactivar.
   * @returns El usuario con el estado actualizado.
   */
  @Auth(Roles_validos.admin)
  @Patch('reactivar/:id_usuario')
  async reactivarUsuario(
    @Param('id_usuario', ParseIntPipe) id_usuario: number,
  ) {
    return await this.usuariosService.reactivarUsuario(id_usuario);
  }
}
