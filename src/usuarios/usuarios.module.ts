import { forwardRef, Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from './entities/usuarios.entity';
import { UsuariosController } from './usuarios.controller';
import { TelefonoService } from 'src/datos-us/telefono/telefono.service';
import { DomicilioService } from 'src/datos-us/domicilio/domicilio.service';
import { EmailService } from 'src/datos-us/email/email.service';
import { NssService } from 'src/datos-us/nss/nss.service';
import { RfcService } from 'src/datos-us/rfc/rfc.service';
import { ImgUsService } from 'src/datos-us/img-us/img-us.service';
import { RolesService } from 'src/datos-us/roles/roles.service';
import { AuthModule } from 'src/auth/auth.module';
import { TelefonoModule } from 'src/datos-us/telefono/telefono.module';
import { EmailModule } from 'src/datos-us/email/email.module';
import { DomicilioModule } from 'src/datos-us/domicilio/domicilio.module';
import { NssModule } from 'src/datos-us/nss/nss.module';
import { RfcModule } from 'src/datos-us/rfc/rfc.module';
import { ImgUsModule } from 'src/datos-us/img-us/img-us.module';
import { RolesModule } from 'src/datos-us/roles/roles.module';

@Module({
  imports: [
    forwardRef(() => AuthModule), // Manejo de la dependencia circular
    TypeOrmModule.forFeature([Usuarios]),
    TelefonoModule,
    EmailModule,
    DomicilioModule,
    NssModule,
    RfcModule,
    ImgUsModule,
    RolesModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
