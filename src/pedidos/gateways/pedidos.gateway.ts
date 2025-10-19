import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Pedidos_has_productos } from '../entities/pedidos_has_productos.entity';
import { Logger } from '@nestjs/common';
import { Producto_extras_ingrSel } from '../interfaces/producto_extras_ingr_sel.type';

@WebSocketGateway({ cors: true })
export class PedidosGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PedidosGateway.name);

  nuevoPedido(pedido: Pedidos_has_productos) {
    this.server.emit('nuevoPedido', pedido);
  }

  // Emitir evento al actualizar estado
  actualizarPedido(pedido: any) {
    this.server.emit('pedido_actualizado', pedido);
  }

  /**
   * Emite un evento cuando se añade un nuevo producto a un pedido.
   * @param productoCompleto Datos del producto añadido, formateados como Producto_extras_ingrSel.
   */
  emitirNuevoProducto(productoCompleto: Producto_extras_ingrSel) {
    this.logger.log(
      `Emitiendo 'nuevoProducto' para producto ID: ${productoCompleto.pedido_prod_id}`,
    );
    // Emitimos a todos los clientes conectados.
    // En el futuro, podrías emitir a salas específicas (ej. 'cocineros', 'meseros').
    this.server.emit('nuevoProducto', productoCompleto);
  }

  /**
   * Emite un evento cuando el estado de un producto cambia (a Preparado o Entregado).
   * @param productoActualizado Datos del producto actualizado, formateados como Producto_extras_ingrSel.
   */
  emitirEstadoActualizado(productoActualizado: Producto_extras_ingrSel) {
    this.logger.log(
      `Emitiendo 'estadoActualizado' para producto ID: ${productoActualizado.pedido_prod_id} (Nuevo estado: ${productoActualizado.estado})`,
    );
    // Emitimos a todos los clientes conectados.
    this.server.emit('estadoActualizado', productoActualizado);
  }
}
