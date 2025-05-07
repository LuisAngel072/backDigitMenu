import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

/**
 * Este DTO, sirve para ir añadiendo productos sobre un pedido
 * O dicho de forma más técnica, agregar registros
 * a la tabla pedidos_has_productos
 */
export class CrPedidosHasProductosDTO {
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
  // Debe recibir el precio calculado desde el front
  @IsNumber()
  precio: number;
  /**
   * Sirven para seleccionar varios extras sobre un producto
   * O de forma más técnica, hace registros en pedidos_has_extrassel
   * Tomar en cuenta que es una tabla aparte, que requiere de primero
   * el registro en pedidos_has_productos
   *
   * Se asigna como number, para que la busqueda de registros se haga en el back
   */
  @IsOptional()
  @IsArray()
  extras: number[];

  // Lo mismo que en extras, pero para la tabla pedidos_has_ingrsel
  // Sin embargo, se plantean que siempre existan ingredientes seleccionados
  @IsOptional()
  @IsArray()
  ingr: number[];
}
