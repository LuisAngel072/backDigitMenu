import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'email' })
export class Email {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id_email' })
  id_email: number;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @OneToMany(() => Usuarios, (usuario) => usuario.email_id)
  usuario: Usuarios;
}
