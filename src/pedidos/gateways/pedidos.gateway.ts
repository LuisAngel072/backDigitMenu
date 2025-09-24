import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Pedidos_has_productos } from '../entities/pedidos_has_productos.entity';

@WebSocketGateway({ cors: true })
export class PedidosGateway {
  @WebSocketServer()
  server: Server;

  nuevoPedido(pedido: Pedidos_has_productos) {
    this.server.emit('nuevoPedido', pedido);
  }

  // Emitir evento al actualizar estado
  actualizarPedido(pedido: any) {
    this.server.emit('pedido_actualizado', pedido);
  }
}
