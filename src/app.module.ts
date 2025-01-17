import { UsuariosModule } from './usuarios/usuarios.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomicilioModule } from './datos-us/domicilio/domicilio.module';
import { TelefonoModule } from './datos-us/telefono/telefono.module';
import { RfcModule } from './datos-us/rfc/rfc.module';
import { NssModule } from './datos-us/nss/nss.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './datos-us/email/email.module';
import { ImgUsModule } from './datos-us/img-us/img-us.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsuariosModule,
    DomicilioModule,
    TelefonoModule,
    RfcModule,
    NssModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: false,
      autoLoadEntities: true,
    }),
    EmailModule,
    ImgUsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
