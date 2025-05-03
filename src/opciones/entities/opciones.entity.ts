import { Pedidos_has_productos } from 'src/pedidos/entities/pedidos_has_productos.entity';
import { Productos_has_opciones } from 'src/productos/entities/productos_has_opciones.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'opciones' })
export class Opciones {
  @PrimaryGeneratedColumn('increment', { name: 'id_opcion', type: 'smallint' })
  id_opcion: number;

  @Column({
    name: 'nombre_opcion',
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  nombre_opcion: string;

  @Column({
    name: 'porcentaje',
    type: 'decimal',
    precision: 5,
    scale: 2,
    unsigned: true,
    nullable: false,
  })
  porcentaje: number;

  @OneToMany(
    () => Productos_has_opciones,
    (prod_has_opc) => prod_has_opc.opcion_id,
  )
  prod_has_opc_id: Productos_has_opciones[];

  @OneToMany(() => Pedidos_has_productos, (p_h_p) => p_h_p.opcion_id)
  p_h_p: Pedidos_has_productos;
}
