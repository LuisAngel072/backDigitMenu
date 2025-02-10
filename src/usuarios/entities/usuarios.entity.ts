import { Domicilios } from "src/datos-us/domicilio/entities/domicilio.entity";
import { Email } from "src/datos-us/email/entities/email.entity";
import { Img_us } from "src/datos-us/img-us/entities/img_us.entity";
import { NSS } from "src/datos-us/nss/entities/nss.entity";
import { RFC } from "src/datos-us/rfc/entities/rfc.entity";
import { UsuariosHasRoles } from "src/datos-us/roles/entities/usuarios_has_roles.entity";
import { Telefonos } from "src/datos-us/telefono/entities/telefono.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from "typeorm";

export enum SexoEnum {
    Masculino = 'Masculino',
    Femenino = 'Femenino',
    Otro = 'Otro',
}

@Entity({name: 'usuarios'})
export class Usuarios {
    @PrimaryGeneratedColumn('increment', {name: 'id_usuario'})
    id_usuario: number;

    @Column({type:'varchar', length: 12, name: 'codigo'}) //Varchar 12
    codigo: string;

    @Column({type:'varchar', length:50, name:'nombres'}) //Varchar 50
    nombres:string

    @Column({type:'varchar', length: 80, name:'primer_apellido'}) //Varchar 80
    primer_apellido: string;
    
    @Column({type:'varchar', length: 80, name:'segundo_apellido'}) //Varchar 80
    segundo_apellido: string;
    
    @Column({enum: SexoEnum, name:'sexo'})
    sexo:string;

    @Column({name: 'contrasena', type:'varchar', length:255})
    contrasena: string;

    @Column({name: 'activo', type:'boolean', default:1})
    activo: boolean;
    
    @ManyToOne(() => Telefonos, (telefono) => telefono.usuario)
    @JoinColumn({name:'telefono_id'})
    telefono_id: Telefonos;

    @ManyToOne(() => Email, (email) => email.usuario)
    @JoinColumn({name:'email_id'})
    email_id: Email;

    @OneToOne(() => Img_us, { nullable: true })
    @JoinColumn({ name: 'img_perfil' })
    img_perfil: Img_us;

    @ManyToOne(() => NSS, (nss) => nss.usuario)
    @JoinColumn({ name: 'nss' })
    nss: NSS;

    @ManyToOne(() => RFC, (rfc) => rfc.usuario)
    @JoinColumn({ name: 'rfc' })
    rfc: RFC;

    @ManyToOne(() => Domicilios, (domicilio) => domicilio.usuario)
    @JoinColumn({ name: 'domicilio' })
    domicilio: Domicilios;

    @OneToMany(() => UsuariosHasRoles, (usuariosHasRoles) => usuariosHasRoles.usuario_id)
    usuariosHasRoles: UsuariosHasRoles[];

}