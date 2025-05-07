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

  //Almacena el precio en el que se compro un producto en ese momento
  @Column({ name: 'precio', type: 'decimal', precision: 7, scale: 2 })
  precio: number;

  @ManyToOne(() => Opciones, (opciones) => opciones.p_h_p)
  @JoinColumn({ name: 'opcion_id' })
  opcion_id: Opciones;

  @OneToMany(() => Pedidos_has_extrassel, (p_h_es) => p_h_es.pedido_extra_id)
  p_h_es: Pedidos_has_extrassel;

  @OneToMany(() => Pedidos_has_ingrsel, (p_h_is) => p_h_is.pedido_ingr_id)
  p_h_is: Pedidos_has_ingrsel;
}
