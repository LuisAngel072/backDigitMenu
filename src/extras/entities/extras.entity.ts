import { Productos_has_extras } from 'src/productos/entities/productos_has_extras.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'extras' })
export class Extras {
  @PrimaryGeneratedColumn('increment', { name: 'id_extra', type: 'smallint' })
  id_extra: number;

  @Column({
    name: 'nombre_extra',
    type: 'varchar',
    length: 80,
    nullable: false,
  })
  nombre_extra: string;

  @Column({
    name: 'precio',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: false,
    unsigned: true,
  })
  precio: number;

  @OneToMany(
    () => Productos_has_extras,
    (prod_has_extra) => prod_has_extra.extra_id,
  )
  prod_has_extra_id: Productos_has_extras[];
}
