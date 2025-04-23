import { Module } from '@nestjs/common';
import { OpcionesController } from './opciones.controller';
import { OpcionesService } from './opciones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opciones } from './entities/opciones.entity';
import { Productos_has_opciones } from 'src/productos/entities/productos_has_opciones.entity';

@Module({
  controllers: [OpcionesController],
  providers: [OpcionesService],
  imports: [TypeOrmModule.forFeature([Opciones, Productos_has_opciones])]
})
export class OpcionesModule {}
