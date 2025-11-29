import { promises as fs } from 'fs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Img_us } from './entities/img_us.entity';
import { Repository } from 'typeorm';
import { CreateImgUsDTO } from './dto/cr-imgus.dto';
import { UpImgUsDTO } from './dto/up-imgus.dto';
import { join } from 'path';

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
        if (!imgDto.img_ruta || imgDto.img_ruta === null) {
          imgDto.img_ruta = 'Pendiente';
        }
        const imgN = this.imgRepository.create(imgDto);
        console.log('Guardando imagen', imgN);
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
  /**
   * Lo que hace es actualizar la ruta de la imagen del usuario. Además, elimina
   * el archivo anterior si la ruta fue cambiada.
   * @param id_img id de la imagen del usuario registrada
   * @param upImgDto cuerpo de actualizacion de la imagen
   * @returns ruta de la imagen actualizada
   */
  async upImg(id_img: number, upImgDto: UpImgUsDTO) {
    try {
      const imgF = await this.imgRepository.findOne({
        where: { id_img: id_img },
      });

      // Consulta la imagen actual (la antigua)
      const previousImg = await this.imgRepository.findOne({
        where: { id_img },
      });
      if (!previousImg) {
        throw new HttpException('Imagen no encontrada', HttpStatus.NOT_FOUND);
      }
      // Guarda la ruta antigua para eliminarla después
      const previousImgRuta = previousImg.img_ruta;
      if (imgF) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const img = await this.imgRepository.update(id_img, upImgDto);
        const updatedImg = await this.imgRepository.findOne({
          where: { id_img },
        });

        // Si la ruta nueva es distinta a la anterior, elimina el archivo antiguo
        if (previousImgRuta && previousImgRuta !== upImgDto.img_ruta) {
          // Construir la ruta completa al archivo (asegúrate de que la carpeta 'uploads' sea la correcta)
          const filePath = join(process.cwd(), 'uploads', previousImgRuta);
          try {
            await fs.unlink(filePath);
            console.log('Archivo eliminado:', filePath);
          } catch (err) {
            console.error('Error al eliminar el archivo:', err);
            // Puedes decidir si lanzar error o continuar
          }
        }

        return updatedImg;
      }
    } catch (error) {
      console.error('Error al guardar el img del usuario:', error);
      throw new HttpException(
        'Ocurrió un error al obtener el registro del img',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
