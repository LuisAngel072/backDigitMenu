import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CrPedidoDto } from './dtos/cr-pedido.dto';
import { UpPedidoDto } from './dtos/up-pedido.dto';
import { CrPedidosHasProductosDTO } from './dtos/cr-pedidos_has_productos.dto';
import { EstadoPedidoHasProductos } from './entities/pedidos_has_productos.entity';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  async getPedidos() {
    return await this.pedidosService.getPedidos();
  }

  @Get('/productos/:id_pedido')
  async getProductosPedido(
    @Param('id_pedido', ParseIntPipe) id_pedido: number,
  ) {
    return await this.pedidosService.getProductosPedido(id_pedido);
  }

  @Get('/productos/:p_h_pr_id')
  async getProductosExtrasIngrSel(
    @Param('p_h_pr_id', ParseIntPipe) p_h_pr_id: number,
  ) {
    return await this.pedidosService.getExtrasIngrDeProducto(p_h_pr_id);
  }

  @Post('registrar')
  async crearPedido(@Body() pedidoDTO: CrPedidoDto) {
    return await this.pedidosService.crearPedido(pedidoDTO);
  }

  @Post('registrar/productos')
  async addProductoAPedido(@Body() p_h_prDTO: CrPedidosHasProductosDTO) {
    return await this.pedidosService.addProductoAPedido(p_h_prDTO);
  }

  @Patch('actualizar/:id_pedido')
  async upPedido(
    @Param('id_pedido', ParseIntPipe) id_pedido: number,
    @Body() pedidoDTO: UpPedidoDto,
  ) {
    return await this.pedidosService.upPedido(id_pedido, pedidoDTO);
  }

  @Patch('actualizar/:pedido_prod_id')
  async cambiarEstado(
    @Param('pedido_prod_id', ParseIntPipe) pedido_prod_id: number,
    @Body() estado: EstadoPedidoHasProductos,
  ) {
    return await this.pedidosService.cambiarEstado(pedido_prod_id, estado);
  }
}
