import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategorias } from './entities/subcategorias.entity';
import { CrearSubcategoriaDto } from './dtos/crear-subcategoria.dto';

@Injectable()
export class SubcategoriasService {
  constructor(
    @InjectRepository(SubCategorias)
    private readonly subcategoriaRepo: Repository<SubCategorias>,
  ) {}

  async obtenerSubcategorias(): Promise<SubCategorias[]> {
    return await this.subcategoriaRepo.find({ relations: ['categoria'] });
  }

  async crearSubcategoria(data: CrearSubcategoriaDto) {
    const nuevaSubcategoria = this.subcategoriaRepo.create(data);
    return await this.subcategoriaRepo.save(nuevaSubcategoria);
  }

  async editarSubcategoria(id: number, data: CrearSubcategoriaDto) {
    const subcategoria = await this.subcategoriaRepo.findOne({ where: { id_subcat: id } });
    if (!subcategoria) throw new NotFoundException('Subcategoría no encontrada');

    Object.assign(subcategoria, data);
    return await this.subcategoriaRepo.save(subcategoria);
  }

  async eliminarSubcategoria(id: number) {
    const subcategoria = await this.subcategoriaRepo.findOne({ where: { id_subcat: id } });
    if (!subcategoria) throw new NotFoundException('Subcategoría no encontrada');

    return await this.subcategoriaRepo.remove(subcategoria);
  }
}