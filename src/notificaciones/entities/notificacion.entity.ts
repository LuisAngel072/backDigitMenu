// src/notificaciones/notificacion.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn({ name: 'id_notf' })
  id_notf: number;

  @Column({ type: 'varchar', length: 255 })
  mensaje: string;

  @Column({ name: 'mesa_id', type: 'smallint', unsigned: true })
  mesa_id: number; // referencia directa a la mesa

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  @Column({ default: 'pendiente' })
  estado: string; // pendiente | atendida

  @Column({ name: 'encargado_por', type: 'int', nullable: true })
  encargado_por: number; // id del mesero que atiende
}
