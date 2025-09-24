// src/mesas/mesas.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from './entities/mesa.entity';
import { CreateMesaDto } from './dto/create-mesa.dto';

@Injectable()
export class MesasService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesasRepository: Repository<Mesa>,
  ) {}

  async findAll(): Promise<Mesa[]> {
    try {
      return await this.mesasRepository.find({
        order: { no_mesa: 'ASC' },
      });
    } catch (error) {
      console.error('❌ Error al obtener todas las mesas:', error);
      throw new HttpException(
        'No se pudieron obtener las mesas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(no_mesa: number): Promise<Mesa | null> {
    try {
      const mesa = await this.mesasRepository.findOne({ where: { no_mesa } });
      return mesa || null;
    } catch (error) {
      console.error(`❌ Error al buscar la mesa ${no_mesa}:`, error);
      throw new HttpException(
        'Error al buscar la mesa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createMesaDto: CreateMesaDto) {
    try {
      const nuevaMesa = this.mesasRepository.create(createMesaDto);
      const result = await this.mesasRepository.save(nuevaMesa);
      return { message: 'Mesa insertada correctamente', result };
    } catch (error) {
      console.error('❌ Error al insertar la mesa:', error);
      throw new HttpException(
        'No se pudo insertar la mesa',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(no_mesa: number) {
    try {
      const mesa = await this.findOne(no_mesa);

      if (!mesa) {
        throw new NotFoundException(
          `No se encontró la mesa con número ${no_mesa}`,
        );
      }

      await this.mesasRepository.remove(mesa);
      return { message: 'Mesa eliminada correctamente' };
    } catch (error) {
      console.error('❌ Error al eliminar la mesa:', error);
      throw new HttpException(
        'No se pudo eliminar la mesa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
