import { IsNumber, IsOptional } from 'class-validator';
import { EstadoPedido } from '../entities/pedidos.entity';

export class UpPedidoDto {
  @IsNumber()
  total: number;

  @IsOptional()
  estado: EstadoPedido;
}
