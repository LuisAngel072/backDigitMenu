// src/notificaciones/notificaciones.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacion])],
  providers: [NotificacionesService],
  controllers: [NotificacionesController],
})
export class NotificacionesModule {}
