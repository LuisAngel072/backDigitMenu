import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'nss' })
export class NSS {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id_nss' })
  id_nss: number;

  @Column({ name: 'nss', type: 'varchar', length: 11 })
  nss: string;

  @OneToMany(() => Usuarios, (usuario) => usuario.nss)
  usuario: Usuarios;
}
