import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { Repository } from 'typeorm';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { UsuariosHasRoles } from './entities/usuarios_has_roles.entity';

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

  /**
   * Está función obtiene todos los roles disponibles en la bd.
   * @returns Arreglo de Roles[]
   */
  async getRoles(): Promise<Roles[]> {
    try {
      const roles = await this.rolesRepository.find();
      return roles;
    } catch (error) {
      console.error('Error al obtener roles:', error);
      throw new HttpException(
        error.message || 'Error interno al obtener roles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Asigna un rol a un usuario específico. Esto haciendo un registro dentro de la tabla
   * UsuariosHasRoles que relaciona Usuarios y Roles en M:M.
   * @param id_usuario Usuario a relacionar
   * @param rol rol a relacionar
   * @returns UsuariosHasRoles creado
   */
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
  /**
   * Obtiene los registros de un usuario específico junto con sus roles asociados. De forma más
   * técnica, obtiene los registros de la tabla UsuariosHasRoles para un usuario dado.
   * @param usuario Usuario del cual se desean obtener su información y todos sus roles
   * @returns Arreglo de Roles asociados al usuario
   */
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
        error.message || 'Error interno al obtener roles de un usuario',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Esta función cambia el rol asignado a un usuario específico.
   * Solo es ejecutada desde usuariosService al momento de actualizar el rol de un usuario
   * @param codigo Código del usuario al cual se le cambiará el rol
   * @param rol_id Nuevo rol a asignar al usuario
   * @returns Rol asignado actualizado
   */
  async cambiarRol(codigo: string, rol_id: Roles): Promise<UsuariosHasRoles> {
    try {
      // Buscar el usuario por código
      const usF: Usuarios = await this.usuariosRepository.findOne({
        where: { codigo: codigo },
      });
      if (!usF) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      // Obtener el registro en la tabla de relación para ese usuario
      const usHrolF = await this.usHrolRepository.find({
        where: { usuario_id: usF },
        relations: ['rol_id'],
      });
      if (!usHrolF || usHrolF.length === 0) {
        throw new HttpException(
          'Rol asignado no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      // Obtener la entidad Roles completa usando el valor recibido
      const rolEntity = await this.rolesRepository.findOne({
        where: { rol: rol_id.rol },
      });
      if (!rolEntity) {
        throw new HttpException('Rol no encontrado', HttpStatus.NOT_FOUND);
      }

      // Actualizar el registro de la relación con la entidad completa
      usHrolF[0].rol_id = rolEntity;
      await this.usHrolRepository.save(usHrolF[0]);
      return usHrolF[0];
    } catch (error) {
      console.error('Error al actualizar el rol asignado al usuario:', error);
      throw new HttpException(
        'Ocurrió un error al obtener el registro rol asignado al usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Obtiene todos los usuarios junto con sus roles asignados + información relacionada.
   * @returns UsuarioHroles[]
   */
  async obtenerUsuariosYRoles() {
    try {
      const usFHrol = await this.usHrolRepository.find({
        relations: [
          'usuario_id',
          'rol_id',
          'usuario_id.domicilio',
          'usuario_id.nss',
          'usuario_id.rfc',
          'usuario_id.email_id',
          'usuario_id.telefono_id',
          'usuario_id.img_perfil',
        ],
      });
      if (!usFHrol) {
        throw new HttpException(
          'No se encontraron usuarios con roles',
          HttpStatus.NOT_FOUND,
        );
      }
      return usFHrol;
    } catch (error) {
      console.error('Error al obtener los usuarios de roles: ', error);
      throw new HttpException(
        'Ocurrió un error al obtener los usuarios de roles',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
