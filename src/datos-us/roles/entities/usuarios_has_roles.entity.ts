import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Usuarios } from "src/usuarios/entities/usuarios.entity"; 
import { Roles } from "./roles.entity"; 

@Entity({ name: 'usuarios_has_roles' })
export class UsuariosHasRoles {
    @PrimaryGeneratedColumn('increment', { name: 'id' }) // Llave primaria automática
    id: number;

    @ManyToOne(() => Usuarios, (usuario) => usuario.usuariosHasRoles, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuarios;

    @ManyToOne(() => Roles, (rol) => rol.usuariosHasRoles, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'rol_id' })
    rol: Roles;
}
