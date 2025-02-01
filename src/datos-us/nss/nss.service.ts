import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NSS } from './entities/nss.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNSSDTO } from './dtos/cr-nss.dto';
import { UpNssDto } from './dtos/up-nss.dto';

@Injectable()
export class NssService {

    constructor(
        @InjectRepository(NSS)
        private readonly nssRepository: Repository<NSS>
    ) {}

    async getNss(nssObj: string) {
        const nss = this.nssRepository.findOne({where:{nss: nssObj}});
        if (nss) {
            return nss;
        } return null;
    }

    async crNss(nssDTO: CreateNSSDTO) {
        try {
            const nssF = await this.getNss(nssDTO.nss);
            if(await nssF) return nssF;
            const nssN = this.nssRepository.create(nssDTO);
            await this.nssRepository.save(nssN);
            return nssN;
        } catch (error) {
            console.error('Error al guardar el NSS:', error);
            throw new HttpException('Ocurrió un error al obtener el registro del NSS', HttpStatus.BAD_REQUEST);
        }
    }

    async upNss(id_nss: number, nssDTO: UpNssDto) {
        try {
            const nssF = await this.nssRepository.findOne({where:{id_nss: id_nss}});
            if(!nssF) {
                throw new HttpException('NSS no encontrado', HttpStatus.NOT_FOUND);
            }
            if(nssF) {
                const nss = await this.nssRepository.update(id_nss, nssDTO);
                return nss;
            }
        } catch (error) {
            console.error('Error al actualizar el NSS:', error);
            throw new HttpException('Ocurrió un error al obtener el registro del NSS', HttpStatus.BAD_REQUEST);
        }
    }
}
