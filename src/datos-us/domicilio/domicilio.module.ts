import { Module } from '@nestjs/common';
import { DomicilioService } from './domicilio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domicilios } from './entities/domicilio.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Domicilios])],
  providers: [DomicilioService]
})
export class DomicilioModule {}
