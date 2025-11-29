import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RFC } from './entities/rfc.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRFCDTO } from './dtos/crRFC.dto';
import { UpRFCDTO } from './dtos/upRFC.dto';
/**
 * Servicio para gestionar operaciones relacionadas con el RFC (Registro Federal de Contribuyentes).
 * Proporciona métodos para crear, obtener y actualizar registros de RFC en la base de datos.
 * No cuenta con métodos para eliminar registros de RFC, ya que generalmente
 * estos se mantienen en la base de datos por razones históricas y de integridad
 * referencial con otros registros que puedan estar asociados a un RFC específico.
 * No cuenta con un controlador debido a que solo es llamado
 * por UsuariosService al momento de crear o actualizar un usuario.
 */
@Injectable()
export class RfcService {
  constructor(
    @InjectRepository(RFC)
    private readonly rfcRepository: Repository<RFC>,
  ) {}

  /**
   * Retorna un RFC existente en base a su valor unico
   * @param rfcObj String de rfc (basicamente el propio rfc es una llave unica)
   * @returns  Retorna RFC en forma de su entidad RFC
   */
  async getRfc(rfcObj: string) {
    const rfc = this.rfcRepository.findOne({ where: { rfc: rfcObj } });
    if (rfc) {
      return rfc;
    }
    return null;
  }
  /**
   * Retorna un RFC creado o existente. Si el RFC ya fue registrado
   * retorna el encontrado
   * De lo contrario, registra un nuevo RFC y lo retorna.
   * @param rfcDTO DTO para registrar un RFC
   * @returns RFC existente o creado
   */
  async crRFC(rfcDTO: CreateRFCDTO) {
    try {
      const rfcF = await this.getRfc(rfcDTO.rfc);
      if (rfcF) return rfcF;
      else {
        if (!rfcDTO.rfc || rfcDTO.rfc === null) {
          rfcDTO.rfc = 'NO ASIGNADO';
        }
        const rfcN = this.rfcRepository.create(rfcDTO);
        await this.rfcRepository.save(rfcN);
        return rfcN;
      }
    } catch (error) {
      console.error('Error al guardar el NSS:', error);
      throw new HttpException(
        'Ocurrió un error al obtener el registro del NSS',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  /**
   * Actualiza un RFC existente en la base de datos.
   * @param id_rfc Id del RFC a actualizar
   * @param rfcDTO Cuerpo en UpRFCDTO, tiene partial type de RFC
   * @returns RFC actualizado
   */
  async upRFC(id_rfc: number, rfcDTO: UpRFCDTO) {
    try {
      const rfcF = await this.rfcRepository.findOne({
        where: { id_rfc: id_rfc },
      });
      if (!rfcF)
        throw new HttpException('RFC no encontrado', HttpStatus.NOT_FOUND);
      if (rfcF) {
        const rfc = await this.rfcRepository.update(id_rfc, rfcDTO);
        return rfc;
      }
    } catch (error) {
      console.error('Error al actualizar el RFC:', error);
      throw new HttpException(
        'Ocurrió un error al obtener el registro del RFC',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
