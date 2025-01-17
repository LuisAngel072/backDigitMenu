import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from './entities/usuarios.entity';
import { Domicilios } from 'src/datos-us/domicilio/entities/domicilio.entity';
import { NSS } from 'src/datos-us/nss/entities/nss.entity';
import { RFC } from 'src/datos-us/rfc/entities/rfc.entity';
import { Telefonos } from 'src/datos-us/telefono/entities/telefono.entity';
import { Roles } from 'src/datos-us/roles/entities/roles.entity';
import { UsuariosHasRoles } from 'src/datos-us/roles/entities/usuarios_has_roles.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Usuarios, Domicilios, NSS, RFC, Telefonos, Roles, UsuariosHasRoles])],
    controllers: [],
    providers: [UsuariosService],
})
export class UsuariosModule {}
