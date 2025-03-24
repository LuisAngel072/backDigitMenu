import { Module } from '@nestjs/common';
import { ImgUsService } from './img-us.service';
import { Img_us } from './entities/img_us.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImgUsController } from './img-us.controller';

@Module({
  imports:[TypeOrmModule.forFeature([Img_us])],
  providers: [ImgUsService],
  controllers: [ImgUsController]
})
export class ImgUsModule {}
