import { Module } from '@nestjs/common';
import { IngredientesService } from './ingredientes.service';
import { IngredientesController } from './ingredientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredientes } from './entities/ingredientes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredientes])],
  providers: [IngredientesService],
  controllers: [IngredientesController],
})
export class IngredientesModule {}
