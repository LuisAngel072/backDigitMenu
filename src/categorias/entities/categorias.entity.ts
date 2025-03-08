import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SubCategorias } from 'src/subcategorias/entities/subcategorias.entity';

@Entity({ name: 'categorias' })
export class Categorias {
  @PrimaryGeneratedColumn({ name: 'id_cat' })
  id_cat: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre_cat: string;

  @OneToMany(() => SubCategorias, (subcategoria) => subcategoria.categoria)
  subcategorias: SubCategorias[];
}
