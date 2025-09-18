import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pedidos_has_productos } from './pedidos_has_productos.entity';
import { Extras } from 'src/extras/entities/extras.entity';

@Entity({ name: 'pedidos_has_extrassel' })
export class Pedidos_has_extrassel {
  @PrimaryGeneratedColumn({ name: 'pedido_extra_id', type: 'int' })
  pedido_extra_id: number;

  @Column({ name: 'precio', type: 'decimal', precision: 5, scale: 2 })
  precio: number;

  // ✅ CORREGIDO: La relación debe referirse a la entidad completa
  @ManyToOne(() => Pedidos_has_productos, (php) => php.extras)
  @JoinColumn({ name: 'pedido_prod_id' })
  pedido_prod_id: Pedidos_has_productos;

  @ManyToOne(() => Extras, (extras) => extras.id_extra)
  @JoinColumn({ name: 'extra_id' })
  extra_id: Extras;
}