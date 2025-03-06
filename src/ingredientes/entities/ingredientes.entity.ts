import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'ingredientes'})
export class Ingredientes {
  @PrimaryGeneratedColumn('increment', { name: 'id_ingr' })
  id_ingr: number;

  @Column({ type: 'varchar', length: 80, nullable: false })
  nombre_ingrediente: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  precio: number;
}
