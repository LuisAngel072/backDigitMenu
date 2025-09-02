// src/notificaciones/notificaciones.controller.ts
import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  // Cliente crea notificación
  @Post()
  create(@Body() dto: CreateNotificacionDto) {
    return this.notificacionesService.create(dto);
  }

  // Mesero consulta notificaciones de una mesa
  @Get('mesa/:mesaId')
  findByMesa(@Param('mesaId') mesaId: number) {
    return this.notificacionesService.findByMesa(+mesaId);
  }

  // Mesero atiende notificación
  @Patch(':id/atender')
  atender(@Param('id') id: number, @Body() dto: UpdateNotificacionDto) {
    return this.notificacionesService.atender(+id, dto);
  }
}