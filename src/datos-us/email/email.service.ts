import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';
import { Repository } from 'typeorm';
import { CreateEmailDto } from './dto/cr-email.dto';

@Injectable()
export class EmailService {
    constructor(
        @InjectRepository(Email)
        private readonly emailRepository: Repository<Email>
    ){}

    /**
     * Esta funcion sirve para obtener un email o fallar (return null)
     * @param em Debe ser del tipo email
     * @returns email o null
     */
    async getEmail(em: string) {
        const email = this.emailRepository.findOne({where:{email: em}})
        if (email) {
            return email;
        } else { return null }
    }

    async crEmail(emDto: CreateEmailDto) {
        const emF = this.getEmail(emDto.email);
        if(emF) {
            return emF;
        }
        const nEm = this.emailRepository.create(emDto);
        await this.emailRepository.save(nEm);

        return nEm;
    }
}
