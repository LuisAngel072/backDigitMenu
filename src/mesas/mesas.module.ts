// src/mesas/mesas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MesasService } from './mesas.service';
import { MesasController } from './mesas.controller';
import { Mesas } from './entities/mesa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mesas])],
  controllers: [MesasController],
  providers: [MesasService],
})
export class MesasModule {}
