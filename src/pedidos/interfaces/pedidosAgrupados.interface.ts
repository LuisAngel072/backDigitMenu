import { Pedidos } from '../entities/pedidos.entity';
import { Producto_extras_ingrSel } from './producto_extras_ingr_sel.type';

export interface PedidoAgrupado {
  pedidoId: Pedidos;
  productos: Producto_extras_ingrSel[];
  expandido: boolean;
  tieneProductosPendientes: boolean;
}
