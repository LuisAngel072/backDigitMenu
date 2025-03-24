
import { Sub_categorias } from 'src/sub-categorias/entities/sub_categorias.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categorias')
export class Categorias {
  @PrimaryGeneratedColumn('increment', { name: 'id_cat', type: 'tinyint' })
  id_cat: number;

  @Column({ name: 'nombre_cat', type: 'varchar', length: 60, nullable: false })
  nombre_cat: string;

  @Column({ name: 'ruta_img', length: 255, nullable: true })
  ruta_img: string;

  @OneToMany(
    () => Sub_categorias,
    (sub_categoria) => sub_categoria.categoria_id,
  )
  sub_categoria: Sub_categorias;

}
