import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'logs' })
export class Logs {
  @PrimaryGeneratedColumn({ name: 'id_log', type: 'int', unsigned: true })
  id_log: number;

  @Column({ name: 'usuario', type: 'varchar', length: 100, nullable: false })
  usuario: string;

  @Column({
    name: 'fecha',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  fecha: Date;

  @Column({ name: 'accion', type: 'varchar', length: 50, nullable: false })
  accion: string;

  @Column({ name: 'descripcion', type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ name: 'modulo', type: 'varchar', length: 50, nullable: false })
  modulo: string;

  @Column({ name: 'ip', type: 'varchar', length: 255, nullable: false })
  ip: string;
}
