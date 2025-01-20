import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
            const usuario = this.usuariosRepository.findOne({where:{codigo: codigo}})
            if(!usuario){throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);    }
            return usuario;    
        } catch (error) {
            throw new HttpException('Oops, algo salió mal', HttpStatus.INTERNAL_SERVER_ERROR);   
        }
    }

    async encontrarUsuarios() {
        try {
            const usuarios = this.usuariosRepository.find()
            if(!usuarios){throw new HttpException('Usuarios no encontrados', HttpStatus.NOT_FOUND);    }
            return usuarios;    
        } catch (error) {
            throw new HttpException('Oops, algo salió mal', HttpStatus.INTERNAL_SERVER_ERROR);   
        }
    }

    async CrearUsuario(usDto: CrearUsuarioDto) {
        try {
          // Verificar si el usuario ya existe por su código
          const usF = await this.encontrarUnUsuario(usDto.codigo); // Asegúrate de que esta función sea `async`
          if (usF) {
            throw new HttpException(
              'El usuario con ese código ya existe, imposible registrar',
              HttpStatus.BAD_REQUEST,
            );
          }
      
          // Crear o asociar entidades relacionadas
          const domicilio = await this.domService.crDom(usDto.domicilio);
          const email = await this.emService.crEmail(usDto.email_id);
          const telefono = await this.telService.crTel(usDto.telefono);
      
          let rfc = null;
          if (usDto.rfc) {
            rfc = await this.rfcService.crRFC(usDto.rfc);
          }
      
          let nss = null;
          if (usDto.nss) {
            nss = await this.nssService.crNss(usDto.nss);
          }
      
          // Busca o crea la imagen de perfil (Img_us)
          let imgPerfil: Img_us | null = null;

          if (usDto.img_perfil) {
            imgPerfil = await this.imgRepository.findOne({ where: { id_img: usDto.img_perfil.id_img } });  
            if (!imgPerfil) {
              throw new HttpException('Imagen de perfil no encontrada', HttpStatus.NOT_FOUND);
            }
          }
          console.log(email);
          console.log(telefono);
          console.log(domicilio);
          console.log(rfc);
          console.log(nss);
          console.log(imgPerfil);
          // Crear instancia del usuario con las relaciones necesarias
          const usuario = this.usuariosRepository.create({
              codigo: usDto.codigo,
              nombres: usDto.nombres,
              primer_apellido: usDto.primer_apellido,
              segundo_apellido: usDto.segundo_apellido || null,
              sexo: usDto.sexo,
              contrasena: bcrypt.hashSync(SHA256(usDto.codigo).toString(), 10),
              img_perfil: imgPerfil, // Relación con la entidad Img_us
              telefono_id: telefono,
              email_id: email,
              domicilio: domicilio,
              rfc: rfc || null,
              nss: nss || null,
          });
          
          // Guardar el usuario en la base de datos
          const nuevoUsuario = await this.usuariosRepository.save(usuario);
      
          // Manejar roles (si están definidos)
          if (usDto.rol && usDto.rol.length > 0) {
            for (const rol of usDto.rol) {
              await this.rolesService.asignarRolAUsuario(usuario.id_usuario, rol.rol);
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
      
}
