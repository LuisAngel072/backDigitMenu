import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'extras'})
export class Extras {
  @PrimaryGeneratedColumn('increment', { name: 'id_extra', type: 'tinyint' })
  id_extra: number;

  @Column({ name: 'id_extra', type: 'varchar', length: 80, nullable: false })
  nombre_extra: string;

  @Column({
    name: 'precio',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: false,
    unsigned: true,
  })
  precio: number;
}
