import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pedidos } from './pedidos.entity';
import { Productos } from 'src/productos/entities/productos.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';
import { Pedidos_has_extrassel } from './pedidos_has_extrasSel.entity';
import { Pedidos_has_ingrsel } from './pedidos_has_ingrSel.entity';

export enum EstadoPedidoHasProductos {
  sin_preparar = 'Sin preparar',
  preparado = 'Preparado',
  entregado = 'Entregado',
  pagado = 'Pagado',
}

@Entity({ name: 'pedidos_has_productos' })
export class Pedidos_has_productos {
  @PrimaryGeneratedColumn({ name: 'pedido_prod_id', type: 'int' })
  pedido_prod_id: number;

  @ManyToOne(() => Pedidos, (pedidos) => pedidos.p_h_p)
  @JoinColumn({ name: 'pedido_id' })
  pedido_id: Pedidos;

  @ManyToOne(() => Productos, (productos) => productos.id_prod)
  @JoinColumn({ name: 'producto_id' })
  producto_id: Productos;

  @Column({
    name: 'estado',
    type: 'enum',
    enum: EstadoPedidoHasProductos,
    nullable: false,
    default: EstadoPedidoHasProductos.sin_preparar,
  })
  estado: EstadoPedidoHasProductos;

  @Column({ name: 'precio', type: 'decimal', precision: 7, scale: 2 })
  precio: number;

  @ManyToOne(() => Opciones, (opciones) => opciones.p_h_p, { nullable: true })
  @JoinColumn({ name: 'opcion_id' })
  opcion_id: Opciones;

  // ✅ CORREGIDO: Relaciones OneToMany deben apuntar al campo correcto y ser arrays
  @OneToMany(() => Pedidos_has_extrassel, (p_h_es) => p_h_es.pedido_prod_id)
  extras: Pedidos_has_extrassel[];

  @OneToMany(() => Pedidos_has_ingrsel, (p_h_is) => p_h_is.pedido_prod_id)
  ingredientes: Pedidos_has_ingrsel[];
}