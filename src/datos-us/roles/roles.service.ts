import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { Repository } from 'typeorm';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { UsuariosHasRoles } from './entities/usuarios_has_roles.entity';
import { CreateUsHRolDTO } from './dtos/cr_usHrol.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Roles)
        private readonly rolesRepository: Repository<Roles>,
        @InjectRepository(UsuariosHasRoles)
        private readonly usHrolRepository: Repository<UsuariosHasRoles>,
        @InjectRepository(Usuarios)
        private readonly usuariosRepository: Repository<Usuarios>,
    ) {}

    async asignarRolAUsuario(id_usuario: number, rol: string) {
        try {
          // Buscar usuario y rol en la base de datos
          const usuario = await this.usuariosRepository.findOne({ where: { id_usuario } });
          const rolF = await this.rolesRepository.findOne({ where: { rol } });
      
          if (!usuario || !rolF) {
            throw new HttpException('Usuario o rol no encontrado', HttpStatus.NOT_FOUND);
          }
      
          // Crear instancia de UsuariosHasRoles
          const usHrol = this.usHrolRepository.create({
            usuario, // Relación con el usuario
            rol: rolF, // Relación con el rol
          });
      
          // Guardar en la base de datos
          await this.usHrolRepository.save(usHrol);
      
          return usHrol;
        } catch (error) {
          console.error('Error al asignar rol al usuario:', error);
          throw new HttpException(
            error.message || 'Error interno al asignar el rol',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
      
}
