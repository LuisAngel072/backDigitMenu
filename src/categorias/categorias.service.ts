import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Categorias } from './entities/categorias.entity';
import { Repository } from 'typeorm';
import { CrearCategoriaDTO } from './dtos/cr-categoria.dto';
import { UpCategoriasDto } from './dtos/up-categorias.dto';
import { join } from 'path';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categorias)
    private readonly categoriasRepository: Repository<Categorias>,
  ) {}

  async getCategorias() {
    try {
      const catF = await this.categoriasRepository.find();

      if (!catF) {
        throw new HttpException(
          'Categorias no encontradas, prueba registrando una',
          HttpStatus.NOT_FOUND,
        );
      }

      return catF;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Oops, algo salió mal al intentar encontrar una categoria',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getCategoria(id_cat: number) {
    try {
      const catF = await this.categoriasRepository.findOne({
        where: { id_cat: id_cat },
      });

      if (!catF) {
        throw new HttpException(
          'Categoria no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      return catF;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Oops, algo salió mal al intentar encontrar una categoria',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async crCategoria(catDto: CrearCategoriaDTO) {
    try {
      const catN = await this.categoriasRepository.create(catDto);
      await this.categoriasRepository.save(catN);

      return catN;
    } catch (error) {
      console.error('Error al guardar la imagen del usuario:', error);
      throw new HttpException(
        'Ocurrió un error al obtener el registro de la imagen',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async upCategoria(id_cat: number, catDto: UpCategoriasDto) {
    try {
      const catF = await this.getCategoria(id_cat);
      console.log(catDto);
      console.log(catF);
      if (!catF) {
        throw new HttpException(
          'Categoria no encontrada',
          HttpStatus.NOT_FOUND,
        );
      } else {
        const ruta_img = catF.ruta_img;
        const catUp = await this.categoriasRepository.update(id_cat, catDto);
        if (ruta_img && ruta_img !== catDto.ruta_img) {
          const ruta = join(process.cwd(), 'uploads', ruta_img);
          try {
            await fs.unlink(ruta);
            console.log('Archivo eliminado:', ruta);
          } catch (err) {
            console.error('Error al eliminar el archivo:', err);
          }
        }
        return catUp;
      }
    } catch (error) {
      console.error('Error al editar la categoria:', error);
      throw new HttpException(
        'Ocurrió un error al actualizar la categoria',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delCategoria(id_cat: number) {
    try {
      const catF = await this.getCategoria(id_cat);

      if (!catF) {
        throw new HttpException(
          'Categoria no encontrada',
          HttpStatus.NOT_FOUND,
        );
      } else {
        const ruta = join(process.cwd(), 'uploads', catF.ruta_img);
        try {
          await fs.unlink(ruta);
          console.log('Archivo eliminado:', ruta);
        } catch (err) {
          console.error('Error al eliminar el archivo:', err);
          // Puedes decidir si lanzar error o continuar
        }
        const catDel = await this.categoriasRepository.delete(id_cat);
        return catDel;
      }
    } catch (error) {
      console.error('Error al eliminar la categoria:', error);
      throw new HttpException(
        'Ocurrió un error al eliminar la categoria',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
