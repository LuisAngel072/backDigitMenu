import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateMesaDto } from './dto/create-mesa.dto';
import * as mysql from 'mysql2/promise';

@Injectable()
export class MesasService {
  private pool: mysql.Pool;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('DB_HOST');
    const user = this.configService.get<string>('DB_USERNAME'); // 👈 o usa 'DB_USER' si cambias el .env
    const password = this.configService.get<string>('DB_PASSWORD');
    const database = this.configService.get<string>('DB_NAME');
    const port = this.configService.get<number>('DB_PORT') || 3306;

    // Log para validar que los valores sí están cargando
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
        throw new Error(`No se encontró la mesa con número ${no_mesa}`);
      }

      return { message: 'Mesa eliminada correctamente' };
    } catch (err) {
      console.error('❌ Error al eliminar mesa:', err);
      throw new InternalServerErrorException('No se pudo eliminar la mesa');
    }
  }
}
