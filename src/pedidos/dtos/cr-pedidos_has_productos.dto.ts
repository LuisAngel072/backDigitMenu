import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

/**
 * Este DTO, sirve para ir añadiendo productos sobre un pedido
 * O dicho de forma más técnica, agregar registros
 * a la tabla pedidos_has_productos
 */
export class CrPedidosHasProductos {
  // El id del pedido, donde proviene la mesa
  @IsNumber()
  pedido_id: number;
  // El id del producto, pedido por el cliente o el mesero
  @IsNumber()
  producto_id: number;
  // La opción del producto seleccionada
  // Es un campo obligatorio
  @IsNumber()
  @IsNotEmpty()
  opcion_id: number;
  @IsOptional()
  @IsArray()
  extras: number[];
}
