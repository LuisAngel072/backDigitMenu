// src/mesas/mesas.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { Mesa } from './entities/mesa.entity';
import * as mysql from 'mysql2/promise';

@Injectable()
export class MesasService {
  private pool: mysql.Pool;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('DB_HOST');
    const user = this.configService.get<string>('DB_USERNAME');
    const password = this.configService.get<string>('DB_PASSWORD');
    const database = this.configService.get<string>('DB_NAME');
    const port = this.configService.get<number>('DB_PORT') || 3306;

    console.log('🔌 Conectando a DB con:', { host, user, database, port });

    this.pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }

  async findAll(): Promise<Mesa[]> {
    try {
      const [rows] = await this.pool.query('SELECT * FROM mesas ORDER BY no_mesa');
      return rows as Mesa[];
    } catch (err) {
      console.error('❌ Error al consultar todas las mesas:', err);
      throw new InternalServerErrorException('No se pudieron obtener las mesas');
    }
  }

  async findOne(no_mesa: number): Promise<Mesa | null> {
    try {
      const [rows] = await this.pool.query(
        'SELECT * FROM mesas WHERE no_mesa = ?',
        [no_mesa]
      );
      
      const mesasArray = rows as Mesa[];
      if (mesasArray.length === 0) {
        return null;
      }
      
      return mesasArray[0];
    } catch (err) {
      console.error(`❌ Error al buscar mesa ${no_mesa}:`, err);
      throw new InternalServerErrorException(`Error al buscar la mesa ${no_mesa}`);
    }
  }

  async create(createMesaDto: CreateMesaDto) {
    const { no_mesa, qr_code_url } = createMesaDto;

    try {
      const [result] = await this.pool.query(
        'INSERT INTO mesas (no_mesa, qr_code_url) VALUES (?, ?)',
        [no_mesa, qr_code_url]
      );
      return { message: 'Mesa insertada correctamente', result };
    } catch (err) {
      console.error('❌ Error real al insertar mesa:', err);
      throw new InternalServerErrorException('No se pudo insertar la mesa');
    }
  }

  async remove(no_mesa: number) {
    try {
      const [result] = await this.pool.query(
        'DELETE FROM mesas WHERE no_mesa = ?',
        [no_mesa]
      );

      if ((result as any).affectedRows === 0) {
        throw new NotFoundException(`No se encontró la mesa con número ${no_mesa}`);
      }

      return { message: 'Mesa eliminada correctamente' };
    } catch (err) {
      console.error('❌ Error al eliminar mesa:', err);
      throw new InternalServerErrorException('No se pudo eliminar la mesa');
    }
  }
}