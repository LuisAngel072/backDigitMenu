import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { Categorias } from './entities/categorias.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categorias])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService],
})
export class CategoriasModule {}
