import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Productos } from './productos.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';

@Entity({ name: 'productos_has_opciones' })
export class Productos_has_opciones {
  @PrimaryGeneratedColumn('increment', {
    name: 'producto_opc_id',
    type: 'int',
  })
  producto_opc_id: number;

  @ManyToOne(() => Productos, (producto) => producto.prod_has_opc_id)
  @JoinColumn({ name: 'producto_id' })
  producto_id: Productos;

  @ManyToOne(() => Opciones, (opcion) => opcion.prod_has_opc_id)
  @JoinColumn({ name: 'opcion_id' })
  opcion_id: Opciones;

  @Column({ name: 'porcentaje', type: 'decimal', precision: 5, scale: 2 })
  precio: number;
}
