import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Productos } from './entities/productos.entity';
import { Productos_has_extras } from './entities/productos_has_extras.entity';
import { Productos_has_ingredientes } from './entities/productos_has_ingredientes.entity';
import { Productos_has_opciones } from './entities/productos_has_opciones.entity';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
  imports: [
    TypeOrmModule.forFeature([
      Productos,
      Productos_has_extras,
      Productos_has_ingredientes,
      Productos_has_opciones,
    ]),
  ],
})
export class ProductosModule {}
