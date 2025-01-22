import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../guards/roles-auth.guard";
import { RoleProtected } from "./rol-protected.decorator";


export function Auth(...roles: Roles_validos[]) {
    return applyDecorators(
      RoleProtected(...roles),
      UseGuards(AuthGuard('jwt'), RolesGuard),
    );
  }
