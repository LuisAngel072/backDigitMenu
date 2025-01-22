import { SetMetadata } from '@nestjs/common';

export const META_ROLES = 'roles';

 export const RoleProtected = (...args: Roles_validos[]) => {
   return SetMetadata(META_ROLES, args);
 };

