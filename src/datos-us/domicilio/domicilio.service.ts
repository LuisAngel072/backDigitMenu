import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Domicilios } from './entities/domicilio.entity';
import { Repository } from 'typeorm';
import { CreateDomicilioDto } from './dtos/cr-dom.dto';
import { UpDomDto } from './dtos/up-dom.dto';
/**
 * Este servicio maneja las operaciones relacionadas con los domicilios,
 * incluyendo la creación, actualización y obtención de domicilios.
 *
 * Este no cuenta con métodos para eliminar domicilios, ya que generalmente
 * los domicilios se mantienen en la base de datos por razones históricas y de integridad
 * referencial con otros registros (en) que puedan estar asociados
 * a un domicilio específico.
 *
 * Además, este servicio no cuenta con un controlador debido a que solo es llamado
 * por UsuariosService al momento de crear o actualizar un usuario.
 */
@Injectable()
export class DomicilioService {
  constructor(
    @InjectRepository(Domicilios)
    private readonly domRepository: Repository<Domicilios>,
  ) {}
  /**
   * Retorna un domicilio por su id
   * @param domicilio id del domicilio registrado
   * @returns Domicilio
   */
  async getDom(domicilio: number) {
    const dom = this.domRepository.findOne({ where: { id_dom: domicilio } });
    if (dom) {
      return dom;
    }
    return null;
  }

  /**
   * Esta función busca un domicilio existente en la base de datos con
   * los datos dados en el dto. Si existe el domicilio, retorna el dom existente
   * De lo contrario, crea un nuevo domicilio y retornalo
   * @param domDto DTO para crear domicilios
   * @returns Domicilio existente o domicilio creado
   */
  async crDom(domDto: CreateDomicilioDto): Promise<Domicilios> {
    try {
      // Verificar si el domicilio ya existe
      const existingDom = await this.domRepository.findOne({
        where: {
          calle: domDto.calle,
          colonia: domDto.colonia,
          codigo_postal: domDto.codigo_postal,
          no_ext: domDto.no_ext,
          no_int: domDto.no_int || null, // Maneja valores opcionales
          municipio: domDto.municipio,
        },
      });

      if (existingDom) {
        // Si el domicilio existe, retornarlo
        return existingDom;
      }

      // Si no existe, crear y guardar el nuevo domicilio
      const newDom = this.domRepository.create(domDto);
      await this.domRepository.save(newDom);

      return newDom;
    } catch (error) {
      console.error('Error al guardar el domicilio:', error);
      throw new HttpException('Domicilio no creado', HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * Actualiza un domicilio existente en la base de datos.
   * @param id_dom Id del domicilio registrado en la bd
   * @param upDomDto Cuerpo de upDomDto en UpDomDto
   * @returns
   */
  async upDom(id_dom: number, upDomDto: UpDomDto) {
    try {
      const domF = await this.getDom(id_dom);
      if (!domF)
        throw new HttpException(
          'Domicilio no encontrado',
          HttpStatus.NOT_FOUND,
        );
      if (domF) {
        await this.domRepository.update(id_dom, upDomDto);
        return await this.getDom(id_dom);
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al intentar actualizar al usuario',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
