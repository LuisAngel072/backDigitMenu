import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from './entities/usuarios.entity';
import { Repository } from 'typeorm';
import { CrearUsuarioDto } from './dtos/crear-usuario.dto';
import { TelefonoService } from 'src/datos-us/telefono/telefono.service';
import { EmailService } from 'src/datos-us/email/email.service';
import { NssService } from 'src/datos-us/nss/nss.service';
import { RfcService } from 'src/datos-us/rfc/rfc.service';
import { DomicilioService } from 'src/datos-us/domicilio/domicilio.service';
import { ImgUsService } from 'src/datos-us/img-us/img-us.service';
import { RolesService } from 'src/datos-us/roles/roles.service';
import * as bcrypt from 'bcrypt';
import { UpUsuarioDto } from './dtos/up-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private readonly usuariosRepository: Repository<Usuarios>,
    private readonly telService: TelefonoService,
    private readonly emService: EmailService,
    private readonly nssService: NssService,
    private readonly rfcService: RfcService,
    private readonly domService: DomicilioService,
    private readonly imgService: ImgUsService,
    private readonly rolesService: RolesService,
  ) {}

  /**
   * @description Funcionalidad principal: Encuentra un usuario específico por su código único.
   * @description Métodos de realización: Utiliza el método `findOne` del `usuariosRepository` para buscar un usuario que coincida con el `codigo`. Incluye la relación con la imagen de perfil. Si no lo encuentra, lanza una excepción `HttpException`.
   * @param {string} codigo - El código único del usuario a buscar.
   * @returns {Promise<Usuarios>} Una promesa que se resuelve con el objeto del usuario encontrado.
   */
  async encontrarUnUsuario(codigo: string) {
    try {
      const usuario = this.usuariosRepository.findOne({
        where: { codigo: codigo },
        relations: { img_perfil: true },
      });
      if (!usuario) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      return usuario;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Oops, algo salió mal al intentar encontrar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Funcionalidad principal: Obtiene una lista de todos los usuarios registrados en el sistema.
   * @description Métodos de realización: Utiliza el método `find` del `usuariosRepository` para obtener todos los registros de la tabla de usuarios.
   * @returns {Promise<Usuarios[]>} Una promesa que se resuelve con un arreglo de todos los objetos de usuario.
   */
  async encontrarUsuarios() {
    try {
      const usuarios = this.usuariosRepository.find();

      if (!usuarios) {
        throw new HttpException(
          'Usuarios no encontrados',
          HttpStatus.NOT_FOUND,
        );
      }
      return usuarios;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Oops, algo salió mal',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Funcionalidad principal: Crea un nuevo usuario y sus datos relacionados en la base de datos.
   * @description Métodos de realización: Verifica si ya existe un usuario con el mismo código. Crea o asocia las entidades relacionadas (domicilio, email, etc.) usando sus servicios. Cifra la contraseña con `bcrypt`. Crea y guarda la instancia del usuario con todas sus relaciones. Finalmente, asigna los roles proporcionados.
   * @param {CrearUsuarioDto} usDto - DTO que contiene toda la información para crear el nuevo usuario.
   * @returns {Promise<Usuarios>} Una promesa que se resuelve con el objeto del nuevo usuario creado.
   */
  async CrearUsuario(usDto: CrearUsuarioDto) {
    try {
      const usF = await this.encontrarUnUsuario(usDto.codigo);
      if (usF) {
        console.log(usF);
        throw new HttpException(
          'El usuario con ese código ya existe, imposible registrar',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Crear o asociar entidades relacionadas
      const domicilio = await this.domService.crDom(usDto.domicilio);
      const email = await this.emService.crEmail(usDto.email_id);
      const telefono = await this.telService.crTel(usDto.telefono_id);
      const imgPerfil = await this.imgService.crImg(usDto.img_perfil);
      const rfc = await this.rfcService.crRFC(usDto.rfc);
      const nss = await this.nssService.crNss(usDto.nss);

      const hashedPassword = await bcrypt.hash(usDto.contrasena, 10);
      // Crear instancia del usuario con las relaciones necesarias
      const usuario = this.usuariosRepository.create({
        codigo: usDto.codigo,
        nombres: usDto.nombres,
        primer_apellido: usDto.primer_apellido,
        segundo_apellido: usDto.segundo_apellido,
        sexo: usDto.sexo,
        contrasena: hashedPassword,
        img_perfil: imgPerfil, // Relación con la entidad Img_us
        telefono_id: telefono,
        email_id: email,
        domicilio: domicilio,
        rfc: rfc,
        nss: nss,
      });

      // Guardar el usuario en la base de datos
      const nuevoUsuario = await this.usuariosRepository.save(usuario);

      // Manejar roles (si están definidos)
      if (usDto.rol && usDto.rol.length > 0) {
        for (const rol of usDto.rol) {
          console.log('Registrando roles: ', rol.rol);
          await this.rolesService.asignarRolAUsuario(
            usuario.id_usuario,
            rol.rol,
          );
        }
      }
      return nuevoUsuario;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw new HttpException(
        error.message || 'No se pudo crear el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Funcionalidad principal: Actualiza la información de un usuario existente y sus datos relacionados.
   * @description Métodos de realización: Busca el usuario por su `id`. Si se proporciona una nueva contraseña, la cifra. Actualiza individualmente cada una de las entidades relacionadas (domicilio, email, etc.) si se incluyen en el DTO. Actualiza los campos directos del usuario y guarda la entidad actualizada. También maneja la actualización de roles.
   * @param {number} id - ID del usuario a actualizar.
   * @param {UpUsuarioDto} usDto - DTO que contiene los campos a actualizar.
   * @returns {Promise<Usuarios>} Una promesa que se resuelve con el objeto del usuario actualizado.
   */
  async actualizarUsuario(id: number, usDto: UpUsuarioDto) {
    try {
      // Buscar el usuario a actualizar
      console.log('DTO recibido:', usDto);
      const usuarioExistente = await this.usuariosRepository.findOne({
        where: { id_usuario: id },
      });

      if (!usuarioExistente) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      // Encriptar la contraseña si se proporciona
      if (usDto.contrasena && usDto.contrasena.trim().length > 0) {
        usDto.contrasena = await bcrypt.hash(usDto.contrasena, 10);
      }

      // Actualizar entidades relacionadas individualmente si se enviaron
      if (usDto.domicilio) {
        console.log('Domicilio recibido:', usDto.domicilio);
        await this.domService.upDom(usDto.domicilio.id_dom, usDto.domicilio);
      }
      if (usDto.email_id) {
        console.log('Email recibido:', usDto.email_id);
        await this.emService.upEmail(usDto.email_id.id_email, usDto.email_id);
      }
      if (usDto.img_perfil) {
        console.log('IMG recibido', usDto.img_perfil);
        await this.imgService.upImg(usDto.img_perfil.id_img, usDto.img_perfil);
      }
      if (usDto.nss) {
        console.log('NSS recibido:', usDto.nss);
        await this.nssService.upNss(usDto.nss.id_nss, usDto.nss);
      }
      if (usDto.rfc) {
        console.log('RFC recibido:', usDto.rfc);
        await this.rfcService.upRFC(usDto.rfc.id_rfc, usDto.rfc);
      }
      if (usDto.telefono_id) {
        console.log('Teléfono recibido:', usDto.telefono_id);
        await this.telService.upTel(
          usDto.telefono_id.id_telefono,
          usDto.telefono_id,
        );
      }
      if (usDto.rol && usDto.rol.length > 0) {
        // Actualizar roles usando el servicio correspondiente
        for (const rol of usDto.rol) {
          console.log('Rol recibido:', rol);
          await this.rolesService.cambiarRol(usDto.codigo, rol);
          console.log('DEPURANDO CICLO FOR');
        }
      }

      // Actualizar el usuario principal
      const camposPermitidos = [
        'codigo',
        'nombres',
        'primer_apellido',
        'segundo_apellido',
        'sexo',
        'contrasena',
      ];

      // Copiar solo los campos permitidos del DTO al usuario existente
      for (const campo of camposPermitidos) {
        if (usDto[campo] !== undefined && usDto[campo] !== null) {
          usuarioExistente[campo] = usDto[campo];
        }
      }

      console.log('Datos a actualizar en usuario principal:', usuarioExistente);

      // Guardar los cambios en la base de datos
      await this.usuariosRepository.save(usuarioExistente);

      // Retornar el usuario actualizado
      return usuarioExistente;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Error al intentar actualizar el usuario',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Esta función sirve para cambiar el estado "activo" de un usuario de 1 a 0
   * Indicando que el usuario ha sido "eliminado", pero sin borrar el registro
   * dentro de la BD.
   * @param id_usuario Usuario a desactivar
   * @returns
   */
  async desactivarUsuario(id_usuario: number) {
    try {
      const usF = await this.usuariosRepository.findOne({
        where: { id_usuario },
      });
      if (!usF) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      // Actualizamos solo la propiedad "activo"
      await this.usuariosRepository.update(id_usuario, { activo: false });
      // Si necesitas devolver la entidad actualizada, la buscas nuevamente
      const usuarioActualizado = await this.usuariosRepository.findOne({
        where: { id_usuario },
      });
      return usuarioActualizado;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al intentar desactivar el usuario',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Esta función sirve para cambiar el estado "activo" de un usuario de 0 a 1
   * Indicando que el usuario ha sido reactivado
   * @param id_usuario Usuario a reactivar
   * @returns
   */
  async reactivarUsuario(id_usuario: number) {
    try {
      const usF = await this.usuariosRepository.findOne({
        where: { id_usuario },
      });
      if (!usF) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      // Actualizamos solo la propiedad "activo"
      await this.usuariosRepository.update(id_usuario, { activo: true });
      // Si necesitas devolver la entidad actualizada, la buscas nuevamente
      const usuarioActualizado = await this.usuariosRepository.findOne({
        where: { id_usuario },
      });
      return usuarioActualizado;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al intentar desactivar el usuario',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
