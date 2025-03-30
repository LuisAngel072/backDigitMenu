import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Productos } from './productos.entity';
import { Extras } from 'src/extras/entities/extras.entity';

@Entity({ name: 'productos_has_extras' })
export class Productos_has_extras {
  @PrimaryGeneratedColumn('increment', {
    name: 'producto_extra_id',
    type: 'int',
  })
  producto_extra_id: number;

  @ManyToOne(() => Productos, (producto) => producto.prod_has_extra_id)
  @JoinColumn({name:'producto_id'})
  producto_id: number;

  @ManyToOne(() => Extras, (extra) => extra.prod_has_extra_id)
  @JoinColumn({name:'extra_id'})
  extra_id: number;

  @Column({ name: 'precio', type: 'decimal', precision: 5, scale: 2 })
  precio: number;
}
