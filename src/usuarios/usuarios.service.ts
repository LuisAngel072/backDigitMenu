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
            const usF = this.encontrarUnUsuario(usDto.codigo);
            if (usF) { throw new HttpException('El usuario con ese código ya existe, imposible registrar', HttpStatus.BAD_REQUEST) }
                    } catch (error) {
            
        }
    }
}
