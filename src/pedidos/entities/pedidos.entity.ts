import { Mesa } from 'src/mesas/entities/mesa.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pedidos_has_productos } from './pedidos_has_productos.entity';

export enum EstadoPedido {
  iniciado = 'Iniciado',
  pagado = 'Pagado',
}

@Entity({ name: 'pedidos' })
export class Pedidos {
  @PrimaryGeneratedColumn({ name: 'id_pedido', type: 'int' })
  id_pedido: number;

  @ManyToOne(() => Mesa, (mesas) => mesas.pedidos)
  @JoinColumn({ name: 'no_mesa', referencedColumnName: 'no_mesa' })
  no_mesa: Mesa;

  @Column({
    name: 'fecha_pedido',
    type: 'datetime',
    default: () => 'NOW()',
  })
  fecha_pedido: Date;

  @Column({
    name: 'total',
    type: 'decimal',
    precision: 7,
    scale: 2,
    default: 0,
  })
  total: number;

  @OneToMany(() => Pedidos_has_productos, (p_h_p) => p_h_p.pedido_id)
  p_h_p: Pedidos_has_productos;
}
