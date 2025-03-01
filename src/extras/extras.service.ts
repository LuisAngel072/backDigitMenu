import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Extras } from './entities/extras.entity';
import { Repository } from 'typeorm';
import { CrExtrasDto } from './dtos/cr-extra.dto';
import { UpExtrasDTO } from './dtos/up-extra.dto';

@Injectable()
export class ExtrasService {
  constructor(
    @InjectRepository(Extras)
    private readonly extrasRepository: Repository<Extras>,
  ) {}

  async getExtras() {
    try {
      const extrasF = await this.extrasRepository.find();

      if (!extrasF) {
        throw new HttpException('Extras no encontrados', HttpStatus.NOT_FOUND);
      }

      return extrasF;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Oops, algo salió mal',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getExtra(id_extra: number) {
    try {
      const extraF = await this.extrasRepository.findOne({
        where: { id_extra: id_extra },
      });

      if (!extraF) {
        throw new HttpException('Extra no encontrado', HttpStatus.NOT_FOUND);
      }

      return extraF;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Oops, algo salió mal',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async crExtra(extrasDto: CrExtrasDto) {
    try {
      const extraN = await this.extrasRepository.create(extrasDto);
      await this.extrasRepository.save(extraN);

      return extraN;
    } catch (error) {
      console.error('Error al guardar el extra:', error);
      throw new HttpException(
        'Ocurrió un error al guardar el extra',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async upExtra(id_extra: number, extrasDto: UpExtrasDTO) {
    try {
      const extraF = await this.getExtra(id_extra);

      if (!extraF) {
        throw new HttpException('extraF no encontrado', HttpStatus.NOT_FOUND);
      }

      const upExtra = await this.extrasRepository.update(id_extra, extrasDto);
      return upExtra;
    } catch (error) {
      console.error('Error al actualizar el extra:', error);
      throw new HttpException(
        'Ocurrió un error al actualizar el extra',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delExtra(id_extra: number) {
    try {
      const extraF = await this.getExtra(id_extra);

      if (!extraF) {
        throw new HttpException('extraF no encontrado', HttpStatus.NOT_FOUND);
      }

      const delExtra = await this.extrasRepository.delete(id_extra);
      return delExtra;
    } catch (error) {
      console.error('Error al eliminar el extra:', error);
      throw new HttpException(
        'Ocurrió un error al eliminar el extra',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
