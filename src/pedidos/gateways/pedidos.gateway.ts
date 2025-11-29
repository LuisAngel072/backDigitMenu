// pedidos.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Producto_extras_ingrSel } from '../interfaces/producto_extras_ingr_sel.type';

@WebSocketGateway({
  cors: {
    // Puedes mantener esta configuración CORS específica o quitarla y confiar en el Adapter
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class PedidosGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PedidosGateway.name);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    this.logger.log('✅ PedidosGateway Inicializado Correctamente');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(
      `🔌 INTENTO de conexión: Cliente ID ${client.id} desde ${client.handshake.address}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Cliente DESCONECTADO: ${client.id}`);
  }

  /**
   * Emite un evento 'nuevoProducto' a todos los clientes conectados cuando se agrega un nuevo producto a un pedido.
   * @param productoCompleto Producto con sus extras e ingredientes seleccionados
   */
  emitirNuevoProducto(productoCompleto: Producto_extras_ingrSel) {
    this.logger.log(
      `Emitiendo 'nuevoProducto' para producto ID: ${productoCompleto.pedido_prod_id}`,
    );
    this.server.emit('nuevoProducto', productoCompleto);
  }
  /**
   * Emite un evento 'estadoActualizado' a todos los clientes conectados cuando se actualiza el estado de un producto en un pedido.
   * @param productoActualizado Producto con su estado actualizado
   */
  emitirEstadoActualizado(productoActualizado: Producto_extras_ingrSel) {
    this.logger.log(
      `Emitiendo 'estadoActualizado' para producto ID: ${productoActualizado.pedido_prod_id} (Nuevo estado: ${productoActualizado.estado})`,
    );
    this.server.emit('estadoActualizado', productoActualizado);
  }
}
