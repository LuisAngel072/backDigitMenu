import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'rfc' })
export class RFC {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id_rfc' })
  id_rfc: number;

  @Column({ name: 'rfc', type: 'varchar', length: 13 })
  rfc: string;

  @OneToMany(() => Usuarios, (usuario) => usuario.rfc)
  usuario: Usuarios;
}
