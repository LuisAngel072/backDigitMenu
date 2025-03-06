import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Opciones } from './entities/opciones.entity';
import { Repository } from 'typeorm';
import { CrOpcionesDto } from './dtos/cr-opciones.dto';
import { UpOpcionesDto } from './dtos/up-opciones.dto';

@Injectable()
export class OpcionesService {
  constructor(
    @InjectRepository(Opciones)
    private readonly opcionesRepository: Repository<Opciones>,
  ) {}

  async getOpciones() {
    try {
      const opciones = await this.opcionesRepository.find();

      if (!opciones) {
        throw new HttpException(
          'No se encontraron opciones',
          HttpStatus.NOT_FOUND,
        );
      }

      return opciones;
    } catch (error) {
      console.error('Ocurrio al obtener las opciones', error);
      throw new HttpException(
        'Ocurrio al obtener las opciones',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getOpcion(id_opcion: number) {
    try {
      const opcF = await this.opcionesRepository.findOne({
        where: { id_opcion: id_opcion },
      });

      if (opcF) {
        throw new HttpException(
          'No se encontró la opción',
          HttpStatus.NOT_FOUND,
        );
      }

      return opcF;
    } catch (error) {
      console.error('Ocurrió un error al obtener la opción', error);
      throw new HttpException(
        'Ocurrió un error al obtener la opción',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async crOpcion(crOpcDto: CrOpcionesDto) {
    try {
      const opcN = await this.opcionesRepository.create(crOpcDto);

      await this.opcionesRepository.save(crOpcDto);

      return opcN;
    } catch (error) {
      console.error('Ocurrió un error al intentar crear la opción');
      throw new HttpException(
        'Ocurrió un error al intentar crear la opción',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async upOpcion(id_opcion: number, upOpcionesDto: UpOpcionesDto) {
    try {
      const opcF = await this.getOpcion(id_opcion);

      if (!opcF) {
        throw new HttpException(
          'No se encontraron opciones',
          HttpStatus.NOT_FOUND,
        );
      } else {
        const opcUp = await this.opcionesRepository.update(
          id_opcion,
          upOpcionesDto,
        );

        return opcUp;
        
      }
    } catch (error) {
      console.error('Ocurrió un error al intentar actualizar la opción');
      throw new HttpException(
        'Ocurrió un error al intentar actualizar la opción',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delOpcion(id_opcion: number) {
    try {
      const opcF = await this.getOpcion(id_opcion);

      if (!opcF) {
        throw new HttpException(
          'No se encontraron opciones',
          HttpStatus.NOT_FOUND,
        );
      } else {
        const opcDel = await this.opcionesRepository.delete(id_opcion);
        return opcDel;
      }
    } catch (error) {
      console.error('Ocurrió un error al intentar eliminar la opción');
      throw new HttpException(
        'Ocurrió un error al intentar eliminar la opción',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
