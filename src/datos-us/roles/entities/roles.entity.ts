import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UsuariosHasRoles } from "./usuarios_has_roles.entity";

@Entity({name: 'roles'})
export class Roles {
    @PrimaryGeneratedColumn('increment', {type:'int', name:'id_rol'})
    id_rol: number;

    @Column({name: 'rol', type:'varchar', length: 20, unique:true})
    rol: string;

    @Column({name: 'descripcion', type:'tinytext'})
    descripcion: string;

    @OneToMany(() => UsuariosHasRoles, (usuariosHasRoles) => usuariosHasRoles.rol)
    usuariosHasRoles: UsuariosHasRoles[];
}
