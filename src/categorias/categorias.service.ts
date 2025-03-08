import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categorias } from './entities/categorias.entity';
import { CrearCategoriaDto } from './dtos/crear-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categorias)
    private readonly categoriaRepo: Repository<Categorias>,
  ) {}

  async obtenerCategorias(): Promise<Categorias[]> {
    return await this.categoriaRepo.find({ relations: ['subcategorias'] });
  }

  async crearCategoria(data: CrearCategoriaDto) {
    const nuevaCategoria = this.categoriaRepo.create(data);
    return await this.categoriaRepo.save(nuevaCategoria);
  }

  async editarCategoria(id: number, data: CrearCategoriaDto) {
    const categoria = await this.categoriaRepo.findOne({ where: { id_cat: id } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');

    Object.assign(categoria, data);
    return await this.categoriaRepo.save(categoria);
  }

  async eliminarCategoria(id: number) {
    const categoria = await this.categoriaRepo.findOne({ where: { id_cat: id } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');

    return await this.categoriaRepo.remove(categoria);
  }
}
