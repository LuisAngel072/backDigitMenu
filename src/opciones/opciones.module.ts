import { Module } from '@nestjs/common';
import { OpcionesController } from './opciones.controller';
import { OpcionesService } from './opciones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opciones } from './entities/opciones.entity';

@Module({
  controllers: [OpcionesController],
  providers: [OpcionesService],
  imports: [TypeOrmModule.forFeature([Opciones])]
})
export class OpcionesModule {}
