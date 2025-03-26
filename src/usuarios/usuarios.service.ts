import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from './entities/usuarios.entity';
import { Repository } from 'typeorm';
import { CrearUsuarioDto } from './dtos/crear-usuario.dto';
import { Telefonos } from 'src/datos-us/telefono/entities/telefono.entity';
import { TelefonoService } from 'src/datos-us/telefono/telefono.service';
import { EmailService } from 'src/datos-us/email/email.service';
import { Email } from 'src/datos-us/email/entities/email.entity';
import { NssService } from 'src/datos-us/nss/nss.service';
import { NSS } from 'src/datos-us/nss/entities/nss.entity';
import { RfcService } from 'src/datos-us/rfc/rfc.service';
import { RFC } from 'src/datos-us/rfc/entities/rfc.entity';
import { DomicilioService } from 'src/datos-us/domicilio/domicilio.service';
import { Domicilios } from 'src/datos-us/domicilio/entities/domicilio.entity';
import { Img_us } from 'src/datos-us/img-us/entities/img_us.entity';
import { ImgUsService } from 'src/datos-us/img-us/img-us.service';
import { RolesService } from 'src/datos-us/roles/roles.service';
import * as bcrypt from 'bcrypt';
import { SHA256 } from 'crypto-js';
import { UpUsuarioDto } from './dtos/up-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private readonly usuariosRepository: Repository<Usuarios>,
    @InjectRepository(Telefonos)
    private readonly telRepository: Repository<Telefonos>,
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    @InjectRepository(NSS)
    private readonly nssRepository: Repository<NSS>,
    @InjectRepository(RFC)
    private readonly rfcRepository: Repository<RFC>,
    @InjectRepository(Domicilios)
    private readonly domRepository: Repository<Domicilios>,
    @InjectRepository(Img_us)
    private readonly imgRepository: Repository<Img_us>,
    private readonly telService: TelefonoService,
    private readonly emService: EmailService,
    private readonly nssService: NssService,
    private readonly rfcService: RfcService,
    private readonly domService: DomicilioService,
    private readonly imgService: ImgUsService,
    private readonly rolesService: RolesService,
  ) {}

  async encontrarUnUsuario(codigo: string) {
    try {
      const usuario = this.usuariosRepository.findOne({
        where: { codigo: codigo },
        relations: {img_perfil: true},
      });
      if (!usuario) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      return usuario;
    } catch (error) {
      throw new HttpException(
        'Oops, algo salió mal al intentar encontrar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
      throw new HttpException(
        'Oops, algo salió mal',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
      console.error(error)
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
