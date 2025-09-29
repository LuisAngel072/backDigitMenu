/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from './entities/usuarios.entity';
import { UsuariosController } from './usuarios.controller';
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
  exports: [UsuariosService, TypeOrmModule],
})
export class UsuariosModule {}
