import { SetMetadata } from '@nestjs/common';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';

export const META_ROLES = 'roles';
<<<<<<< HEAD

=======
/**
 * Decorador personalizado para proteger rutas basadas en roles de usuario.
 * Permite especificar uno o más roles que tienen permiso para acceder a la ruta.
 * @param args Roles válidos que pueden acceder a la ruta protegida
 * @returns Metadatos con los roles permitidos.
 */
>>>>>>> main
export const RoleProtected = (...args: Roles_validos[]) => {
  return SetMetadata(META_ROLES, args);
};
