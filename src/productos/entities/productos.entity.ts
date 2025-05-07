import { Sub_categorias } from 'src/sub-categorias/entities/sub_categorias.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Productos_has_extras } from './productos_has_extras.entity';
import { Productos_has_ingredientes } from './productos_has_ingredientes.entity';
import { Productos_has_opciones } from './productos_has_opciones.entity';
import { Pedidos_has_productos } from 'src/pedidos/entities/pedidos_has_productos.entity';

@Entity({ name: 'productos' })
export class Productos {
  @PrimaryGeneratedColumn('increment', {
    name: 'id_prod',
    type: 'smallint',
  })
  id_prod: number;

  @Column({ type: 'varchar', name: 'nombre_prod' })
  nombre_prod: string;

  @Column({ name: 'descripcion', type: 'varchar', length: 255 })
  descripcion: string;

  @Column({ name: 'img_prod', type: 'varchar', length: 255 })
  img_prod: string;

  @Column({ name: 'precio', type: 'decimal', precision: 7, scale: 2 })
  precio: number;

  @OneToMany(
    () => Productos_has_extras,
    (prod_has_extra) => prod_has_extra.producto_id,
  )
  prod_has_extra_id: Productos_has_extras[];

  @OneToMany(
    () => Productos_has_ingredientes,
    (prod_has_ingr) => prod_has_ingr.producto_id,
  )
  prod_has_ingr_id: Productos_has_ingredientes[];

  @OneToMany(
    () => Productos_has_opciones,
    (prod_has_opc) => prod_has_opc.producto_id,
  )
  prod_has_opc_id: Productos_has_opciones[];

  @ManyToOne(() => Sub_categorias, (sub_cat) => sub_cat.producto)
  @JoinColumn({ name: 'sub_cat_id' })
  sub_cat_id: Sub_categorias;

  @OneToMany(() => Pedidos_has_productos, (p_h_p) => p_h_p.producto_id)
  p_h_p: Pedidos_has_productos;
}