import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles-auth.guard';
import { RoleProtected } from './rol-protected.decorator';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';
/**
 * Auth es un decorador personalizado que combina la protección de rutas mediante JWT
 * y la verificación de roles de usuario. Utiliza los guardias AuthGuard y RolesGuard
 * para asegurar que solo los usuarios autenticados con los roles adecuados puedan acceder
 * a las rutas protegidas.
 * @param roles Rol del usuario que está intentando ingresar a una API protegida
 * @returns Acceso a la ruta protegida si el usuario tiene el rol adecuado
 */
export function Auth(...roles: Roles_validos[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  );
}
