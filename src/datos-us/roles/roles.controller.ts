import { Body, Controller, Get } from '@nestjs/common';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { RolesService } from './roles.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';
/**
 * Estas son apis que solo sirven para obtener o los roles existentes, o los usuarios con sus roles
 * Estas apis solo pueden ser accedidas por usuarios con rol de Admin
 */
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Obtiene los roles asociados a un usuario específico.
   * Esta API está protegida y solo los usuarios con rol de 'Admin' pueden acceder a ella.
   * Ruta: GET /roles/getUsYrol
   * Lleva el decorador @Auth con el rol de 'Admin' para restringir el acceso.
   * @param usuario Usuario del cual se desean obtener los roles
   * @returns Roles asociados al usuario
   */
  @Auth(Roles_validos.admin)
  @Get('getUsYrol')
  async getRolesByUsuario(@Body() usuario: Usuarios) {
    return await this.rolesService.getRolesByUsuario(usuario);
  }
  /**
   * Obtiene todos los usuarios junto con sus roles.
   * Esta API está protegida y solo los usuarios con rol de 'Admin' pueden acceder a ella.
   * Ruta: GET /roles/getUsuarios
   * Lleva el decorador @Auth con el rol de 'Admin' para restringir el acceso.
   * @returns Lista de usuarios con sus roles
   */
  @Auth(Roles_validos.admin)
  @Get('getUsuarios')
  async getUsuariosConRoles() {
    return await this.rolesService.obtenerUsuariosYRoles();
  }
  /**
   * Obtiene todos los roles disponibles en el sistema.
   * Esta API está protegida y solo los usuarios con rol de 'Admin' pueden acceder a ella.
   * Ruta: GET /roles
   * Lleva el decorador @Auth con el rol de 'Admin' para restringir el acceso.
   * @returns Lista de roles
   */
  @Auth(Roles_validos.admin)
  @Get()
  async getRoles() {
    return await this.rolesService.getRoles();
  }
}
