import { forwardRef, Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from './entities/usuarios.entity';
import { Domicilios } from 'src/datos-us/domicilio/entities/domicilio.entity';
import { NSS } from 'src/datos-us/nss/entities/nss.entity';
import { RFC } from 'src/datos-us/rfc/entities/rfc.entity';
import { Telefonos } from 'src/datos-us/telefono/entities/telefono.entity';
import { Roles } from 'src/datos-us/roles/entities/roles.entity';
import { UsuariosHasRoles } from 'src/datos-us/roles/entities/usuarios_has_roles.entity';
import { UsuariosController } from './usuarios.controller';
import { Email } from 'src/datos-us/email/entities/email.entity';
import { Img_us } from 'src/datos-us/img-us/entities/img_us.entity';
import { TelefonoService } from 'src/datos-us/telefono/telefono.service';
import { DomicilioService } from 'src/datos-us/domicilio/domicilio.service';
import { EmailService } from 'src/datos-us/email/email.service';
import { NssService } from 'src/datos-us/nss/nss.service';
import { RfcService } from 'src/datos-us/rfc/rfc.service';
import { ImgUsService } from 'src/datos-us/img-us/img-us.service';
import { RolesService } from 'src/datos-us/roles/roles.service';
import { AuthModule } from 'src/auth/auth.module';


@Module({
    imports: [
      forwardRef(() => AuthModule), // Manejo de la dependencia circular
      TypeOrmModule.forFeature([
        Usuarios,
        Domicilios,
        NSS,
        RFC,
        Telefonos,
        Roles,
        UsuariosHasRoles,
        Email,
        Img_us,
      ]),
    ],
    controllers: [UsuariosController],
    providers: [
      UsuariosService,
      TelefonoService,
      EmailService,
      DomicilioService,
      NssService,
      RfcService,
      ImgUsService,
      RolesService,
    ],
    exports: [UsuariosService, TypeOrmModule],
  })
  export class UsuariosModule {}
  
