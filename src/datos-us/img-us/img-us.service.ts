import {
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Img_us } from './entities/img_us.entity';
import { Repository } from 'typeorm';
import { CreateImgUsDTO } from './dto/cr-imgus.dto';
import { UpImgUsDTO } from './dto/up-imgus.dto';

@Injectable()
export class ImgUsService {
  constructor(
    @InjectRepository(Img_us)
    private readonly imgRepository: Repository<Img_us>,
  ) {}

  async getImg(img_r: string) {
    const img = this.imgRepository.findOne({ where: { img_ruta: img_r } });
    if (img) {
      return img;
    }
    return null;
  }

  /**
   * Retorna una imagen creada o existente. Si la imagen ya fue cargada
   * retorna la encontrada
   * De lo contrario, registra una ruta de la imagen y la retorna.
   * @param imgDto DTO para registrar una ruta de imagen
   * @returns imagen existente o creada
   */
  async crImg(imgDto: CreateImgUsDTO) {
    try {
      const imgF = await this.getImg(imgDto.img_ruta);
      if (imgF !== null) return imgF;
      else {
        const imgN = this.imgRepository.create(imgDto);
        console.log('Guardando imagen', imgN)
        await this.imgRepository.save(imgN);

        return imgN;
      }
    } catch (error) {
      console.error('Error al guardar la imagen del usuario:', error);
      throw new HttpException(
        'Ocurrió un error al obtener el registro de la imagen',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async upImg(id_img: number, upImgDto: UpImgUsDTO) {
    try {
      const imgF = await this.getImg(upImgDto.img_ruta);
      if (!imgF) {
        throw new HttpException('ImgUs no encontrado', HttpStatus.NOT_FOUND);
      }
      if (imgF) {
        const img = await this.imgRepository.update(id_img, upImgDto);
        return img;
      }
    } catch (error) {
      console.error('Error al guardar el img del usuario:', error);
      throw new HttpException(
        'Ocurrió un error al obtener el registro del img',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
