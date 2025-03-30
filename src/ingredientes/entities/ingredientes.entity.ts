import { Productos_has_ingredientes } from 'src/productos/entities/productos_has_ingredientes.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'ingredientes'})
export class Ingredientes {
  @PrimaryGeneratedColumn('increment', { name: 'id_ingr', type:'smallint' })
  id_ingr: number;

  @Column({ type: 'varchar', length: 80, nullable: false })
  nombre_ingrediente: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  precio: number;

  @OneToMany(() => Productos_has_ingredientes, (prod_has_ingr) => prod_has_ingr.ingrediente_id)
    prod_has_ingr_id: Productos_has_ingredientes[];
}
