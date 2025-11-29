import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'img_us' })
export class Img_us {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id_img' })
  id_img: number;

  @Column({ name: 'img_ruta', type: 'varchar', length: 255 })
  img_ruta: string;

  @OneToMany(() => Usuarios, (usuario) => usuario.img_perfil)
  usuario: Usuarios;
}
