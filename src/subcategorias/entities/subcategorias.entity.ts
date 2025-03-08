import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Categorias } from 'src/categorias/entities/categorias.entity';

@Entity({ name: 'subcategorias' })
export class SubCategorias {
  @PrimaryGeneratedColumn({ name: 'id_subcat' })
  id_subcat: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre_subcat: string;

  @ManyToOne(() => Categorias, (categoria) => categoria.subcategorias, { onDelete: 'CASCADE' })
  categoria: Categorias;
}
