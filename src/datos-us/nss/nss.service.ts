import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NSS } from './entities/nss.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNSSDTO } from './dtos/cr-nss.dto';
import { UpNssDto } from './dtos/up-nss.dto';
/**
 * Servicio para gestionar operaciones relacionadas con el NSS (Número de Seguridad Social).
 * Proporciona métodos para crear, obtener y actualizar registros de NSS en la base de datos.
 * No cuenta con métodos para eliminar registros de NSS, ya que generalmente
 * estos se mantienen en la base de datos por razones históricas y de integridad
 * referencial con otros registros que puedan estar asociados a un NSS específico.
 * No cuenta con un controlador debido a que solo es llamado
 * por UsuariosService al momento de crear o actualizar un usuario.
 */
@Injectable()
export class NssService {
  constructor(
    @InjectRepository(NSS)
    private readonly nssRepository: Repository<NSS>,
  ) {}

  /**
   * Retorna un NSS existente en base a su valor unico
   * @param nssObj String de nss (basicamente el propio nss es una llave unica)
   * @returns  Retorna NSS en forma de su entidad NSS
   */
  async getNss(nssObj: string) {
    const nss = this.nssRepository.findOne({ where: { nss: nssObj } });
    if (nss) {
      return nss;
    }
    return null;
  }
  /**
   * Retorna un NSS creado o existente. Si el NSS ya fue registrado
   * retorna el encontrado
   * De lo contrario, registra un nuevo NSS y lo retorna.
   * @param nssDTO DTO para registrar un NSS
   * @returns NSS existente o creado
   */
  async crNss(nssDTO: CreateNSSDTO) {
    try {
      const nssF = await this.getNss(nssDTO.nss);
      if (await nssF) return nssF;
      else {
        if (!nssDTO.nss || nssDTO.nss === null) {
          nssDTO.nss = 'NO ASIGNADO';
        }
        const nssN = this.nssRepository.create(nssDTO);
        await this.nssRepository.save(nssN);
        return nssN;
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
   * Actualiza un NSS existente en la base de datos.
   * @param id_nss Id del NSS a actualizar
   * @param nssDTO Cuerpo en UpNssDto, tiene partial type de CreateNSSDTO
   * @returns NSS actualizado
   */
  async upNss(id_nss: number, nssDTO: UpNssDto) {
    try {
      const nssF = await this.nssRepository.findOne({
        where: { id_nss: id_nss },
      });
      if (!nssF) {
        throw new HttpException('NSS no encontrado', HttpStatus.NOT_FOUND);
      }
      if (nssF) {
        const nss = await this.nssRepository.update(id_nss, nssDTO);
        return nss;
      }
    } catch (error) {
      console.error('Error al actualizar el NSS:', error);
      throw new HttpException(
        'Ocurrió un error al obtener el registro del NSS',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
