import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'telefonos' })
export class Telefonos {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id_telefono' })
  id_telefono: number;

  @Column({ name: 'telefono', type: 'varchar', length: 12 })
  telefono: string;

  @OneToMany(() => Usuarios, (usuario) => usuario.telefono_id)
  usuario: Usuarios;
}
