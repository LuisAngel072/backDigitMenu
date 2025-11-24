import { SetMetadata } from '@nestjs/common';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: Roles_validos[]) => {
  return SetMetadata(META_ROLES, args);
};
