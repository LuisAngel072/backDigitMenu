import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sub_categorias } from './entities/sub_categorias.entity';
import { Repository } from 'typeorm';
import { Categorias } from 'src/categorias/entities/categorias.entity';
import { CrSubCategoriasDTO } from './dtos/cr-sub_cat.dto';
import { UpSubCatDTO } from './dtos/up-sub_cat.dto';

@Injectable()
export class SubCategoriasService {
  constructor(
    @InjectRepository(Sub_categorias)
    private readonly sub_categorias_repository: Repository<Sub_categorias>,
    @InjectRepository(Categorias)
    private readonly categorias_repository: Repository<Categorias>,
  ) {}

  async getSubCategorias() {
    try {
      const subCats = await this.sub_categorias_repository.find();

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
        nombre_subcat: subCatDto.nombre_cat,
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

  async upSubCat(id_subcat: number, upSubCatDTO: UpSubCatDTO) {
    try {
      const subCatF = await this.getSubCategoria(id_subcat);

      if (subCatF) {
        const catF = await this.categorias_repository.findOne({
          where: { id_cat: upSubCatDTO.categoria_id },
        });

        if (!catF) {
          throw new HttpException(
            'Categoria no encontrada',
            HttpStatus.NOT_FOUND,
          );
        } else {
          const bodySubCat = {
            nombre_subcat: upSubCatDTO.nombre_cat,
            ruta_img: upSubCatDTO.ruta_img,
            categoria_id: catF,
          };

          const subCatUp = this.sub_categorias_repository.update(
            id_subcat,
            bodySubCat,
          );

          return subCatUp;
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

  async delSubCat(id_subcat: number) {
    try {
      const subCatF = await this.getSubCategoria(id_subcat);

      if (subCatF) {
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
