import { IsNumber } from 'class-validator';

export class CrPedidoDto {
  // Primero se asigna el número de mesa en el pedido. Se calculará el total
  // por mediante PATCH constantes que haga el cliente o el mesero
  @IsNumber()
  no_mesa: number;
}
