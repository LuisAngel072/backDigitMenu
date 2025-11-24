import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categorias } from './entities/categorias.entity';
import { Sub_categorias } from 'src/sub-categorias/entities/sub_categorias.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categorias, Sub_categorias])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
