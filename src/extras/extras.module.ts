import { Module } from '@nestjs/common';
import { ExtrasController } from './extras.controller';
import { ExtrasService } from './extras.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Extras } from './entities/extras.entity';
import { Productos_has_extras } from 'src/productos/entities/productos_has_extras.entity';

@Module({
  controllers: [ExtrasController],
  providers: [ExtrasService],
  imports: [TypeOrmModule.forFeature([Extras, Productos_has_extras])],
})
export class ExtrasModule {}
