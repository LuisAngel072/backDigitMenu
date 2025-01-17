import { Injectable } from '@nestjs/common';
import { Telefonos } from './entities/telefono.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TelefonoService {

    constructor(
        @InjectRepository(Telefonos)
        private readonly telRepository: Repository<Telefonos>
    ) {}

    /**
     * Esta funcion sirve para obtener un telefono o fallar
     * @param tel Debe ser del tipo Telefonos
     * @returns telefono o null
     */
    async getTel(tel: Telefonos) {
        const telefono = this.telRepository.findOne({where:{id_telefono: tel.id_telefono}})
        if (telefono) {
            return telefono;
        } else { return null }
            
    }
}
