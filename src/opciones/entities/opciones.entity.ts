import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'opciones'})
export class Opciones {
  @PrimaryGeneratedColumn('increment', { name: 'id_opcion', type: 'tinyint' })
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
}
