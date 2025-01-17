import { Usuarios } from "src/usuarios/entities/usuarios.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity({name: 'domicilio'})
export class Domicilios {
    @PrimaryGeneratedColumn('increment', {type:'int', name:'id_dom'})
    id_dom: number;

    @Column({name: 'calle', type:'tinytext'})
    calle: string;

    @Column({name: 'colonia', type:'tinytext'})
    colonia: string;

    @Column({name:'codigo_postal', type:'varchar', length: 5,})
    codigo_postal:string;

    @Column({name:'no_ext', type:'varchar', length: 5,})
    no_ext: string;

    @Column({name:'no_int', type:'varchar', length: 5,})
    no_int: string;

    @Column({name:'municipio', type:'tinytext',})
    municipio: string;

    @OneToMany(() => Usuarios, (usuario) => usuario.domicilio)
    usuario: Usuarios;
}