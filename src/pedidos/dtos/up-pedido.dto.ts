import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { EstadoPedido } from '../entities/pedidos.entity';

export class UpPedidoDto {
  @IsNumber()
  @IsOptional()
  total: number;

  @IsEnum(EstadoPedido)
  @IsOptional()
  estado: EstadoPedido;
}
