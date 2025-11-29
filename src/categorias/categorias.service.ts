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
  /**
   * Obtiene todas las categorías disponibles en la base de datos.
   * @returns Arreglo Categorias[]
   */
  async getCategorias(): Promise<Categorias[]> {
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
  /**
   * Obtiene una categoría específica por su ID.
   * @param id_cat ID de la categoria a consultar
   * @returns Objeto tipo ategorias
   */
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
  /**
   * Crea una nueva categoría en la base de datos.
   * @param catDto Cuerpo con estructura CrearCategoriaDto
   * @returns Categoria creada Categorias
   */
  async crCategoria(catDto: CrearCategoriaDTO) {
    try {
      const catN = await this.categoriasRepository.create(catDto);
      await this.categoriasRepository.save(catN);

      return catN;
    } catch (error) {
      console.error('Error al guardar la categoria en la bd:', error);
      throw new HttpException(
        'Ocurrió un error al crear la categoria',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  /**
   * Actualiza una categoría existente en la base de datos.
   * @param id_cat Id de la categoria a actualizar
   * @param catDto cuerpo del objeto en UpCategoriasDto
   * @returns Update Result
   */
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
        /**
         * Eliminar la imagen anterior si la ruta ha cambiado
         */
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
  /**
   * Elimina una categoría de la base de datos.
   * @param id_cat ID de la categoria a eliminar
   * @returns Categoria eliminada
   */
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
