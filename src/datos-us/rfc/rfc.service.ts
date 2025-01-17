import { Injectable } from '@nestjs/common';
import { RFC } from './entities/rfc.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
}
