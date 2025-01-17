import { Module } from '@nestjs/common';
import { ImgUsService } from './img-us.service';

@Module({
  providers: [ImgUsService]
})
export class ImgUsModule {}
