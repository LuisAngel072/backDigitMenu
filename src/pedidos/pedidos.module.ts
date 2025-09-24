import { Module } from '@nestjs/common';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedidos } from './entities/pedidos.entity';
import { Pedidos_has_extrassel } from './entities/pedidos_has_extrasSel.entity';
import { Pedidos_has_ingrsel } from './entities/pedidos_has_ingrSel.entity';
import { Productos } from 'src/productos/entities/productos.entity';
import { Mesa } from 'src/mesas/entities/mesa.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';
import { Ingredientes } from 'src/ingredientes/entities/ingredientes.entity';
import { Extras } from 'src/extras/entities/extras.entity';
import { Pedidos_has_productos } from './entities/pedidos_has_productos.entity';
import { PedidosGateway } from './gateways/pedidos.gateway';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService, PedidosGateway],
  imports: [
    TypeOrmModule.forFeature([
      Pedidos,
      Pedidos_has_extrassel,
      Pedidos_has_ingrsel,
      Pedidos_has_productos,
      Productos,
      Mesa,
      Opciones,
      Extras,
      Ingredientes,
    ]),
  ],
})
export class PedidosModule {}
