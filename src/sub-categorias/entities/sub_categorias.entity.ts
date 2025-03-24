import { Categorias } from 'src/categorias/entities/categorias.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sub_categorias')
export class Sub_categorias {
  @PrimaryGeneratedColumn('increment', { name: 'id_subcat', type: 'tinyint' })
  id_subcat: number;

  @Column({ name: 'nombre_subcat', type: 'varchar', length: 60 })
  nombre_subcat: string;

  @Column({ name: 'ruta_img', type: 'varchar', length: 255 })
  ruta_img: string;

  @ManyToOne(() => Categorias, (categorias) => categorias.sub_categoria)
  @JoinColumn({name:'categoria_id'})
  categoria_id: Categorias;
}
