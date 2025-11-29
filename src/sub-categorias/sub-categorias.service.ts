import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sub_categorias } from './entities/sub_categorias.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Categorias } from 'src/categorias/entities/categorias.entity';
import { CrSubCategoriasDTO } from './dtos/cr-sub_cat.dto';
import { UpSubCatDTO } from './dtos/up-sub_cat.dto';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class SubCategoriasService {
  constructor(
    @InjectRepository(Sub_categorias)
    private readonly sub_categorias_repository: Repository<Sub_categorias>,
    @InjectRepository(Categorias)
    private readonly categorias_repository: Repository<Categorias>,
  ) {}

  /**
   * @description Funcionalidad principal: Obtiene todas las subcategorías existentes en la base de datos.
   * @description Métodos de realización: Utiliza el método `find` del repositorio para buscar todas las subcategorías, incluyendo la relación con su categoría principal.
   * @returns {Promise<Sub_categorias[]>} Una promesa que se resuelve en un arreglo de todas las subcategorías.
   */
  async getSubCategorias() {
    try {
      const subCats = await this.sub_categorias_repository.find({
        relations: { categoria_id: true },
      });

      if (!subCats) {
        throw new HttpException(
          'No se encontraros subcategorias, intente registrar una',
          HttpStatus.NOT_FOUND,
        );
      }
      return subCats;
    } catch (error) {
      console.error('Ocurrió un error al obtener las subcategorias', error);
      throw new HttpException(
        'Ocurrio un error al intentar obtener las subcategorias: ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Funcionalidad principal: Obtiene una subcategoría específica por su ID.
   * @description Métodos de realización: Usa el método `findOne` del repositorio para buscar una subcategoría que coincida con el ID proporcionado.
   * @param {number} id_subcat - El ID de la subcategoría a buscar.
   * @returns {Promise<Sub_categorias>} Una promesa que se resuelve en la entidad de la subcategoría encontrada.
   */
  async getSubCategoria(id_subcat: number) {
    try {
      const subCatF = await this.sub_categorias_repository.findOne({
        where: { id_subcat: id_subcat },
      });

      if (!subCatF) {
        throw new HttpException(
          'No se encontró la subcategoria solicitada',
          HttpStatus.NOT_FOUND,
        );
      }

      return subCatF;
    } catch (error) {
      console.error('Ocurrió un error al obtener la subcategoria', error);
      throw new HttpException(
        'Fallo al obtener la subcategoria:',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Funcionalidad principal: Crea una nueva subcategoría en la base de datos.
   * @description Métodos de realización: Busca la categoría principal por ID. Si existe, crea una nueva entidad de subcategoría con los datos del DTO y la guarda en el repositorio.
   * @param {CrSubCategoriasDTO} subCatDto - DTO con los datos para crear la nueva subcategoría.
   * @returns {Promise<Sub_categorias>} Una promesa que se resuelve en la nueva subcategoría creada.
   */
  async crSubCat(subCatDto: CrSubCategoriasDTO) {
    try {
      const catF = await this.categorias_repository.findOne({
        where: { id_cat: subCatDto.categoria_id },
      });

      if (!catF) {
        throw new HttpException(
          'Categoria no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      const bodySubCat = {
        nombre_subcat: subCatDto.nombre_subcat,
        ruta_img: subCatDto.ruta_img,
        categoria_id: catF,
      };

      const subCatN = await this.sub_categorias_repository.create(bodySubCat);

      this.sub_categorias_repository.save(subCatN);

      return subCatN;
    } catch (error) {
      console.error('Error al guardar la imagen del usuario:', error);
      throw new HttpException(
        'Ocurrió un error al obtener el registro de la imagen',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * @description Funcionalidad principal: Actualiza una subcategoría existente.
   * @description Métodos de realización: Busca la subcategoría por ID. Si se proporciona
   * una nueva imagen, elimina la anterior. Luego, actualiza los datos de la subcategoría
   * en el repositorio.
   * @param {number} id_subcat - El ID de la subcategoría a actualizar.
   * @param {UpSubCatDTO} upSubCatDTO - DTO con los nuevos datos para la subcategoría.
   * @returns {Promise<UpdateResult>} Una promesa que se resuelve con el resultado de la operación de actualización.
   */
  async upSubCat(
    id_subcat: number,
    upSubCatDTO: UpSubCatDTO,
  ): Promise<UpdateResult> {
    try {
      const subCatF = await this.getSubCategoria(id_subcat);

      if (subCatF) {
        const catF = await this.categorias_repository.findOne({
          where: { id_cat: upSubCatDTO.categoria_id },
        });

        if (!catF) {
          throw new HttpException(
            'SubCategoria no encontrada',
            HttpStatus.NOT_FOUND,
          );
        } else {
          const ruta_img = subCatF.ruta_img;
          const bodySubCat = {
            nombre_subcat: upSubCatDTO.nombre_subcat,
            ruta_img: upSubCatDTO.ruta_img,
            categoria_id: catF,
          };

          const subCatUp = this.sub_categorias_repository.update(
            id_subcat,
            bodySubCat,
          );
          if (ruta_img && ruta_img !== upSubCatDTO.ruta_img) {
            const ruta = join(process.cwd(), 'uploads', ruta_img);
            try {
              await fs.unlink(ruta);
              console.log('Archivo eliminado:', ruta);
            } catch (err) {
              console.error('Error al eliminar el archivo:', err);
              // Puedes decidir si lanzar error o continuar
            }

            return subCatUp;
          }
        }
      }
    } catch (error) {
      console.error('Error al editar la subcategoria:', error);
      throw new HttpException(
        'Ocurrió un error al actualizar la subcategoria',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Funcionalidad principal: Elimina una subcategoría de la base de datos.
   * @description Métodos de realización: Busca la subcategoría por ID,
   * elimina el archivo de imagen asociado del sistema de archivos y luego
   * elimina el registro de la base de datos usando el método `delete`.
   * @param {number} id_subcat - El ID de la subcategoría a eliminar.
   * @returns {Promise<any>} Una promesa que se resuelve cuando la eliminación es completada.
   */
  async delSubCat(id_subcat: number) {
    try {
      const subCatF = await this.getSubCategoria(id_subcat);

      if (subCatF) {
        const ruta = join(process.cwd(), 'uploads', subCatF.ruta_img);
        try {
          await fs.unlink(ruta);
          console.log('Archivo eliminado:', ruta);
        } catch (err) {
          console.error('Error al eliminar el archivo:', err);
          // Puedes decidir si lanzar error o continuar
        }
        const delSubCatf =
          await this.sub_categorias_repository.delete(id_subcat);
        return delSubCatf;
      }
    } catch (error) {
      console.error('Error al eliminar la subcategoria:', error);
      throw new HttpException(
        'Ocurrió un error al eliminar la subcategoria',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
