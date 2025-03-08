import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subcategorias } from './subcategorias.entity';

@Entity({ name: 'categorias' })
export class Categorias {
  @PrimaryGeneratedColumn('increment', { name: 'id_cat' })
  id_cat: number;

  @Column({ type: 'varchar', length: 100, name: 'nombre_cat' })
  nombre_cat: string;

  @OneToMany(() => Subcategorias, (subcategoria) => subcategoria.categoria)
  subcategorias: Subcategorias[];
}
