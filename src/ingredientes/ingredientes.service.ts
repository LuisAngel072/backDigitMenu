import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CrearIngredienteDTO } from './dtos/create-ingrediente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredientes } from './entities/ingredientes.entity';
import { Repository } from 'typeorm';
import { UpIngredienteDTO } from './dtos/up-ingrediente.dto';

@Injectable()
export class IngredientesService {
  constructor(
    @InjectRepository(Ingredientes)
    private readonly ingredientesRepository: Repository<Ingredientes>,
  ) {}

  async obtenerIngredientes() {
    try {
      const ingredientes = this.ingredientesRepository.find();

      if (!ingredientes) {
        throw new HttpException(
          'Ingredientes no encontrados',
          HttpStatus.NOT_FOUND,
        );
      }
      return ingredientes;
    } catch (error) {
      throw new HttpException(
        'Oops, algo salió mal',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async crearIngrediente(body: CrearIngredienteDTO) {
    try {
      const ingrN = this.ingredientesRepository.create(body);
      await this.ingredientesRepository.save(ingrN);

      return ingrN;
    } catch (error) {
      console.error('Error al guardar el ingrediente:', error);
      throw new HttpException(
        'Ocurrió un error al guardar el ingrediente',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updtIngrediente(id_ingr: number, body: UpIngredienteDTO) {
    try {
      const ingrF = this.ingredientesRepository.findOne({
        where: { id_ingr: id_ingr },
      });

      if (!ingrF) {
        throw new HttpException('IngrF no encontrado', HttpStatus.NOT_FOUND);
      }

      const upIngr = this.ingredientesRepository.update(id_ingr, body);
      return upIngr;
    } catch (error) {
      console.error('Error al actualizar el ingrediente:', error);
      throw new HttpException(
        'Ocurrió un error al actualizar el ingrediente',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  delIngr(id_ingr: number) {
    try {
      const ingrF = this.ingredientesRepository.findOne({
        where: { id_ingr: id_ingr },
      });

      if (!ingrF) {
        throw new HttpException('IngrF no encontrado', HttpStatus.NOT_FOUND);
      }

      const delIngr = this.ingredientesRepository.delete(id_ingr);
      return delIngr;
    } catch (error) {
      console.error('Error al eliminar el ingrediente:', error);
      throw new HttpException(
        'Ocurrió un error al eliminar el ingrediente',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
