import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Telefonos } from './entities/telefono.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTelefonosDTO } from './dtos/cr_tel.dto';

@Injectable()
export class TelefonoService {

    constructor(
        @InjectRepository(Telefonos)
        private readonly telRepository: Repository<Telefonos>
    ) {}

    /**
     * Esta funcion sirve para obtener un telefono o fallar
     * @param tel Debe ser el telefono en string
     * @returns telefono o null
     */
    async getTel(tel: string) {
        const telefono = this.telRepository.findOne({where:{telefono: tel}})
        if (telefono) {
            return telefono;
        } else { return null }       
    }

    async crTel(telDTO: CreateTelefonosDTO) {
        try {
            const telF = await this.getTel(telDTO.telefono);
            if(telF) return telF;
            const telG = this.telRepository.create(telDTO);
            await this.telRepository.save(telG);
            return telG;            
        } catch (error) {
            console.error('Error al guardar el telefono:', error);
            throw new HttpException('Ocurrió un error al obtener el registro del telefono', HttpStatus.BAD_REQUEST);
        }
    }
}
