import { Productos } from 'src/productos/entities/productos.entity';
import { Pedidos } from '../entities/pedidos.entity';
import { EstadoPedidoHasProductos } from '../entities/pedidos_has_productos.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';
import { Extras } from 'src/extras/entities/extras.entity';
import { Ingredientes } from 'src/ingredientes/entities/ingredientes.entity';

export type Producto_extras_ingrSel = {
  pedido_id: Pedidos;
  producto_id: Productos;
  estado: EstadoPedidoHasProductos;
  precio: number;
  opcion_id: Opciones;
  extras?: Extras[];
  ingredientes?: Ingredientes[];
};
