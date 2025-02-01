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
      const usuario = await this.usuariosRepository.findOne({
        where: { id_usuario },
      });
      const rolF = await this.rolesRepository.findOne({ where: { rol } });

      if (!usuario || !rolF) {
        throw new HttpException(
          'Usuario o rol no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      // Crear instancia de UsuariosHasRoles
      const usHrol = this.usHrolRepository.create({
        usuario_id: usuario, // Relación con el usuario
        rol_id: rolF, // Relación con el rol
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

  async getRolesByUsuario(usuario: Usuarios) {
    try {
      const roles = await this.usHrolRepository.find({
        where: { usuario_id: usuario },
        relations: ['rol_id'],
      });

      return roles.map((userRole) => userRole.rol_id);
    } catch (error) {
      console.error('Error al encontrar el rol del usuario:', error);
      throw new HttpException(
        error.message || 'Error interno al asignar el rol',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async cambiarRol(codigo: string, rol_id: Roles) {
    try {
      const usF: Usuarios = await this.usuariosRepository.findOne({where:{codigo: codigo}});
      const usHrolF = this.usHrolRepository.find({
        where:{usuario_id:usF},
        relations: ['rol_id'],
      });
      if(!usHrolF) { throw new HttpException('Rol asignado no encontrado', HttpStatus.NOT_FOUND);}
      if(usHrolF) {
        usHrolF[0] = rol_id;
        const usHRol = this.usHrolRepository.update(rol_id.id_rol, usHrolF[0]);
        return usHRol;
      }
    } catch (error) {
      console.error('Error al actualizar el rol asignado al usuario:', error);
            throw new HttpException('Ocurrió un error al obtener el registro rol asignado al usuario', HttpStatus.BAD_REQUEST);
    }
  }
}
