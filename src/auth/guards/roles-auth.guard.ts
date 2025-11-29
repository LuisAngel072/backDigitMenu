import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
<<<<<<< HEAD

=======
/**
 * Guardia de roles para proteger rutas basadas en roles de usuario.
 * Utiliza metadatos definidos en los controladores para verificar si el usuario tiene
 * el rol necesario para acceder a la ruta.
 */
>>>>>>> main
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!roles.includes(user.rol)) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a esta ruta',
      );
    }
    return true;
  }
}
