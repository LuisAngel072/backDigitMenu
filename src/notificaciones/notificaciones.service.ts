// src/notificaciones/notificaciones.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notifRepo: Repository<Notificacion>,
  ) {}

  async create(dto: CreateNotificacionDto): Promise<Notificacion> {
    const notif = this.notifRepo.create({
      mensaje: dto.mensaje,
      mesa_id: dto.mesa_id,
    });
    return this.notifRepo.save(notif);
  }

  async findByMesa(mesa_id: number): Promise<Notificacion[]> {
    return this.notifRepo.find({
      where: { mesa_id },
      order: { creado_en: 'DESC' },
    });
  }

  async atender(id: number, dto: UpdateNotificacionDto): Promise<Notificacion> {
    const notif = await this.notifRepo.findOne({ where: { id_notf: id } });
    if (!notif) throw new NotFoundException('Notificación no encontrada');

    // Actualizar estado - usar el valor que viene del frontend
    if (dto.estado) {
      notif.estado = dto.estado;
    }

    // Si viene encargado_por, lo asignamos
    if (dto.encargado_por) {
      notif.encargado_por = dto.encargado_por;
    }

    return this.notifRepo.save(notif);
  }
}
