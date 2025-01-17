import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NSS } from './entities/nss.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
}
