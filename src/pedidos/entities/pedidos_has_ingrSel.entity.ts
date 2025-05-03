import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pedidos_has_productos } from './pedidos_has_productos.entity';
import { Ingredientes } from 'src/ingredientes/entities/ingredientes.entity';

@Entity({ name: 'pedidos_has_ingrsel' })
export class Pedidos_has_ingrsel {
  @PrimaryGeneratedColumn({ name: 'pedido_ingr_id', type: 'int' })
  pedido_ingr_id: number;

  @Column({ name: 'precio', type: 'decimal', precision: 5, scale: 2 })
  precio: number;

  @ManyToOne(
    () => Pedidos_has_productos,
    (pedidos_has_productos) => pedidos_has_productos.pedido_prod_id,
  )
  @JoinColumn({ name: 'pedido_prod_id' })
  pedido_prod_id: Pedidos_has_productos;

  @ManyToOne(() => Ingredientes, (ingr) => ingr.id_ingr)
  @JoinColumn({ name: 'ingrediente_id' })
  ingrediente_id: Ingredientes;
}
