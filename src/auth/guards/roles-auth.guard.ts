import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      console.log("HOLAAAAAAA desde guard")
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      console.log('Roles esperados:', roles); // Debug
      console.log('Usuario en la request:', request.user); // Debug
  
      if (!roles.includes(user.rol)) {
        throw new ForbiddenException('No tienes permisos para acceder a esta ruta');
      }
      return true;
    }
  }
  