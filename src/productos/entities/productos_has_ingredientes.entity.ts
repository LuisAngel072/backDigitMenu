import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Productos } from './productos.entity';
import { Ingredientes } from 'src/ingredientes/entities/ingredientes.entity';

@Entity({ name: 'productos_has_ingredientes' })
export class Productos_has_ingredientes {
  @PrimaryGeneratedColumn('increment', {
    name: 'prod_ingr_id',
    type: 'int',
  })
  prod_ingr_id: number;

  @ManyToOne(() => Productos, (producto) => producto.prod_has_ingr_id)
  @JoinColumn({ name: 'producto_id' })
  producto_id: Productos;

  @ManyToOne(() => Ingredientes, (ingrediente) => ingrediente.prod_has_ingr_id)
  @JoinColumn({ name: 'ingrediente_id' })
  ingrediente_id: Ingredientes;

  @Column({ name: 'precio', type: 'decimal', precision: 5, scale: 2 })
  precio: number;
}
