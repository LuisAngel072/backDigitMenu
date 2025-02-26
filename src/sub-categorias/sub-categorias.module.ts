import { Module } from '@nestjs/common';
import { SubCategoriasController } from './sub-categorias.controller';
import { SubCategoriasService } from './sub-categorias.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sub_categorias } from './entities/sub_categorias.entity';
import { Categorias } from 'src/categorias/entities/categorias.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sub_categorias, Categorias])],
  controllers: [SubCategoriasController],
  providers: [SubCategoriasService],
})
export class SubCategoriasModule {}
