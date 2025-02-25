import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';
import { Repository } from 'typeorm';
import { CreateEmailDto } from './dto/cr-email.dto';
import { UpEmailDto } from './dto/up-email.dto';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
  ) {}

  /**
   * Esta funcion sirve para obtener un email o fallar (return null)
   * @param em Debe ser del tipo email string
   * @returns email o null
   */
  async getEmail(em: string) {
    const email = this.emailRepository.findOne({ where: { email: em } });
    if (email) {
      return email;
    } else {
      return null;
    }
  }

  /**
   * Retorna un email creado o existente. Si el email existe, retorna el encontrado
   * De lo contrario, crea un email y retornalo.
   * @param emDto DTO para registrar un email
   * @returns Email existente o email creado
   */
  async crEmail(emDto: CreateEmailDto) {
    try {
      console.log('******************');
      console.log(emDto);
      console.log('******************');
      const emF = await this.getEmail(emDto.email);

      if (emF) {
        console.log('******************');
        console.log(emF);
        console.log('******************');
        return emF;
      } else {
        const nEm = this.emailRepository.create(emDto);
        await this.emailRepository.save(nEm);
        return nEm;
      }
    } catch (error) {
      console.error('Error al guardar el email:', error);
      throw new HttpException(
        'Ocurrió un error al obtener el registro del email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async upEmail(id_email: number, upEmailDto: UpEmailDto) {
    try {
      const emailF = this.emailRepository.findOne({
        where: { id_email: id_email },
      });
      if (!emailF)
        throw new HttpException('Email no encontrado', HttpStatus.NOT_FOUND);
      if (emailF) {
        const email = await this.emailRepository.update(id_email, upEmailDto);
        return email;
      }
    } catch (error) {
      console.error('Error al guardar el email:', error);
      throw new HttpException(
        'Ocurrió un error al obtener el registro del email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
