import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoriasController } from './subcategorias.controller';
import { SubcategoriasService } from './subcategorias.service';
import { SubCategorias } from './entities/subcategorias.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategorias])],
  controllers: [SubcategoriasController],
  providers: [SubcategoriasService],
  exports: [SubcategoriasService],
})
export class SubcategoriasModule {}
