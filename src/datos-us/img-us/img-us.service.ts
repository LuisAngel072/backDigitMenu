import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Img_us } from './entities/img_us.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImgUsService {
    constructor(
        @InjectRepository(Img_us)
        private readonly imgRepository: Repository<Img_us>
    ){}
    
    async getImg(img_r: string) {
        const img = this.imgRepository.findOne({where:{img_ruta: img_r}});
        if (img) {
        return img;
        } return null;
    }
}
