import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from './entities/logs.entity';
import { Repository } from 'typeorm';
import { CrLogDto } from './dto/cr-log.dto';

@Injectable()
export class LogsdbService {
  constructor(
    @InjectRepository(Logs)
    private readonly logsRepository: Repository<Logs>,
  ) {}

  /**
   * Retorna todos los logs registrados dentro de la base de datos.
   * @returns Logs registrados en la bd;
   */
  async getLogs(): Promise<Logs[]> {
    try {
      const logs = await this.logsRepository.find();
      return logs;
    } catch (error) {
      throw new HttpException(
        `Ocurrió un error al intentar obtener los logs: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Esta api es llamada cuando el usuario da clic al botón de "Ver Log".
   * Consulta en un log
   * @param id_log llave primaria del log a consultar
   * @returns
   */
  async getLog(id_log: number): Promise<Logs> {
    try {
      const logF = await this.logsRepository
        .findOneOrFail({
          where: { id_log: id_log },
        })
        .catch((error) => {
          throw new HttpException(
            `No se encontró el log con id ${id_log}: ${error}`,
            HttpStatus.NOT_FOUND,
          );
        });
      return logF;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        `No se encontró el log con id ${id_log}: ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Esta función crea registros en la tabla LOGS
   * Debe reistrar inicios de sesión y cualquier acción que se pueda realizar
   * en el módulo de administrador.
   * @param logDto DTO para registrar un log
   * @returns Log Creado
   */
  async crearLog(logDto: CrLogDto, ip: string) {
    try {
      const logConIp = {
        ...logDto,
        ip: ip,
      };
      const log = this.logsRepository.create(logConIp);
      return await this.logsRepository.save(log);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        `Ocurrió un error al intentar crear el log: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
