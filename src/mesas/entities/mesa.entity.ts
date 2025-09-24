// src/mesas/mesa.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Pedidos } from 'src/pedidos/entities/pedidos.entity';

@Entity('mesas')
@Unique(['no_mesa']) // para reflejar que es único como en tu DB
export class Mesa {
  @PrimaryGeneratedColumn({ name: 'id_mesa', type: 'smallint', unsigned: true })
  id_mesa: number;

  @Column({ name: 'no_mesa', type: 'tinyint', unsigned: true })
  no_mesa: number;

  @Column({ name: 'qr_code_url', type: 'varchar', length: 255, nullable: true })
  qr_code_url: string;

  @OneToMany(() => Pedidos, (pedidos) => pedidos.no_mesa)
  pedidos: Pedidos;
}
