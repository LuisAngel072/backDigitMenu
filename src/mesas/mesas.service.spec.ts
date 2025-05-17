// src/mesas/mesas.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from './entities/mesa.entity';
import { CreateMesaDto } from './dto/create-mesa.dto';

@Injectable()
export class MesasService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
  ) {}

  async create(dto: CreateMesaDto): Promise<Mesa> {
    const nuevaMesa = this.mesaRepository.create(dto);
    return this.mesaRepository.save(nuevaMesa); // Maneja errores únicos si quieres
  }
}