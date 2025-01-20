import { Module } from '@nestjs/common';
import { NssService } from './nss.service';
import { NSS } from './entities/nss.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([NSS])],
  providers: [NssService]
})
export class NssModule {}
