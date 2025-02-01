import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RFC } from './entities/rfc.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRFCDTO } from './dtos/crRFC.dto';
import { UpRFCDTO } from './dtos/upRFC.dto';

@Injectable()
export class RfcService {
    constructor(
      @InjectRepository(RFC)
      private readonly rfcRepository: Repository<RFC>
    ) {}

    async getRfc(rfcObj: string) {
        const rfc = this.rfcRepository.findOne({where:{rfc: rfcObj}});
        if (rfc) {
            return rfc;
        } return null;
    }

    async crRFC(rfcDTO: CreateRFCDTO) {
        try {
            const rfcF = await this.getRfc(rfcDTO.rfc)
            if(rfcF) return rfcF;
            const rfcN = this.rfcRepository.create(rfcDTO);
            await this.rfcRepository.save(rfcN);
            return rfcN;
        } catch (error) {
            console.error('Error al guardar el NSS:', error);
            throw new HttpException('Ocurrió un error al obtener el registro del NSS', HttpStatus.BAD_REQUEST);
        }
    }

    async upRFC(id_rfc:number,rfcDTO:UpRFCDTO) {
        try {
            const rfcF = await this.rfcRepository.findOne({where:{id_rfc:id_rfc}})
            if(!rfcF) throw new HttpException('RFC no encontrado', HttpStatus.NOT_FOUND);;
            if(rfcF) {
                const rfc = await this.rfcRepository.update(id_rfc, rfcDTO);
                return rfc;
            }
        }catch(error) {
            console.error('Error al actualizar el RFC:', error);
            throw new HttpException('Ocurrió un error al obtener el registro del RFC', HttpStatus.BAD_REQUEST);
        }
    }
}
