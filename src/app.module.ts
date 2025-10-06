import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DomicilioModule } from './datos-us/domicilio/domicilio.module';
import { TelefonoModule } from './datos-us/telefono/telefono.module';
import { RfcModule } from './datos-us/rfc/rfc.module';
import { NssModule } from './datos-us/nss/nss.module';
import { EmailModule } from './datos-us/email/email.module';
import { ImgUsModule } from './datos-us/img-us/img-us.module';
import { AuthModule } from './auth/auth.module';
import { IngredientesModule } from './ingredientes/ingredientes.module';
import { CategoriasModule } from './categorias/categorias.module';
import { SubCategoriasModule } from './sub-categorias/sub-categorias.module';
import { ExtrasModule } from './extras/extras.module';
import { OpcionesModule } from './opciones/opciones.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ProductosModule } from './productos/productos.module';
import { MesasModule } from './mesas/mesas.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { LogsdbModule } from './logsdb/logsdb.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    UsuariosModule,
    CategoriasModule, // Agrega aquí
    SubCategoriasModule, // Agrega aquí
    DomicilioModule,
    TelefonoModule,
    RfcModule,
    NssModule,
    EmailModule,
    ImgUsModule,
    AuthModule,
    IngredientesModule,
    CategoriasModule,
    SubCategoriasModule,
    ExtrasModule,
    OpcionesModule,
    PedidosModule,
    ProductosModule,
    MesasModule,
    NotificacionesModule,
    LogsdbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
