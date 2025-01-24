import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from './entities/roles.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { UsuariosHasRoles } from './entities/usuarios_has_roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature(
      [
        Roles,
        Usuarios,UsuariosHasRoles])],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}
