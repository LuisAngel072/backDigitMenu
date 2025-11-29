import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CrPedidoDto } from './dtos/cr-pedido.dto';
import { UpPedidoDto } from './dtos/up-pedido.dto';
import { CrPedidosHasProductosDTO } from './dtos/cr-pedidos_has_productos.dto';
import {
  EstadoPedidoHasProductos,
  Pedidos_has_productos,
} from './entities/pedidos_has_productos.entity';
import { Producto_extras_ingrSel } from './interfaces/producto_extras_ingr_sel.type';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';
import { PedidoAgrupado } from './interfaces/pedidosAgrupados.interface';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  /**
   * Obtiene todos los pedidos registrados en la base de datos.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: GET /pedidos
   * @returns Pedidos[]
   */
  @Get()
  async getPedidos() {
    return await this.pedidosService.getPedidos();
  }
  /**
   * Obtiene todos los pedidos activos junto con sus detalles.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: GET /pedidos/activos/:rol
   * @param rol Rol del usuario que realiza la solicitud (ejemplo: 'mesero', 'cocinero', etc.)
   * @returns PedidoAgrupado[]
   */
  @Get('activos/:rol')
  async getPedidosActivosConDetalles(
    @Param('rol') rol: string,
  ): Promise<PedidoAgrupado[]> {
    return await this.pedidosService.getPedidosActivosConDetalles(rol);
  }
  /**
   * Obtiene los extras e ingredientes seleccionados para un producto específico en un pedido.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: GET /pedidos/productos/extrasIngrs/:p_h_pr_id
   * @param p_h_pr_id ID del producto en el pedido
   * @returns Producto_extras_ingrSel
   */
  @Get('/productos/extrasIngrs/:p_h_pr_id')
  async getProductosExtrasIngrSel(
    @Param('p_h_pr_id') p_h_pr_id: any,
  ): Promise<Producto_extras_ingrSel> {
    return await this.pedidosService.getExtrasIngrDeProducto(p_h_pr_id);
  }
  /**
   * Obtiene los productos asociados a un pedido específico.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: GET /pedidos/productos/:id_pedido/:rol
   * @param id_pedido ID del pedido
   * @param rol Rol del usuario que realiza la solicitud (puede ser nulo)
   * @returns Pedidos_has_productos[]
   */
  @Get('/productos/:id_pedido/:rol')
  async getProductosPedido(
    @Param('id_pedido', ParseIntPipe) id_pedido: number,
    @Param('rol') rol: string | null,
  ): Promise<Pedidos_has_productos[]> {
    return await this.pedidosService.getProductosPedido(id_pedido, rol);
  }
  /**
   * Obtiene un pedido iniciado (en estado 'En Proceso' o 'Preparando') por el número de mesa.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: GET /pedidos/no_mesa/:no_mesa
   * @param no_mesa Número de la mesa
   * @returns Pedido iniciado o null si no existe
   */
  @Get('/no_mesa/:no_mesa')
  async getPedidoIniciadoByNoMesa(
    @Param('no_mesa', ParseIntPipe) no_mesa: number,
  ) {
    return await this.pedidosService.getPedidoIniciadoByNoMesa(no_mesa);
  }
  /**
   * Crea un nuevo pedido en la base de datos.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: POST /pedidos/registrar
   * @param pedidoDTO DTO para crear un nuevo pedido
   * @returns Pedido creado
   */
  @Post('registrar')
  async crearPedido(@Body() pedidoDTO: CrPedidoDto) {
    return await this.pedidosService.crearPedido(pedidoDTO);
  }
  /**
   * Agrega un producto a un pedido existente.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: POST /pedidos/registrar/productos
   * @param p_h_prDTO DTO para agregar un producto al pedido
   * @returns Producto agregado al pedido
   */
  @Post('registrar/productos')
  async addProductoAPedido(@Body() p_h_prDTO: CrPedidosHasProductosDTO) {
    return await this.pedidosService.addProductoAPedido(p_h_prDTO);
  }
  /**
   * Cambia el estado de un producto en un pedido.
   * Esta API está protegida y solo los usuarios con roles de 'Cocinero', 'Cajero' o 'Mesero' pueden acceder a ella.
   * Ruta: PATCH /pedidos/pedido_prod/actualizar/:pedido_prod_id
   * Lleva el decorador @Auth con los roles permitidos para restringir el acceso.
   * @param pedido_prod_id ID del producto en el pedido cuyo estado se va a cambiar
   * @param estado Nuevo estado del producto en el pedido
   * @returns Producto en el pedido con el estado actualizado
   */
  @Patch('pedido_prod/actualizar/:pedido_prod_id')
  @Auth(Roles_validos.cocinero, Roles_validos.cajero, Roles_validos.mesero)
  async cambiarEstado(
    @Param('pedido_prod_id', ParseIntPipe) pedido_prod_id: number,
    @Body('estado') estado: EstadoPedidoHasProductos,
  ) {
    return await this.pedidosService.cambiarEstado(pedido_prod_id, estado);
  }
  /**
   * Actualiza un pedido existente en la base de datos.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: PATCH /pedidos/actualizar/:id_pedido
   * @param id_pedido ID del pedido a actualizar
   * @param pedidoDTO DTO para actualizar el pedido
   * @returns Pedido actualizado
   */
  @Patch('actualizar/:id_pedido')
  async upPedido(
    @Param('id_pedido', ParseIntPipe) id_pedido: number,
    @Body() pedidoDTO: UpPedidoDto,
  ) {
    return await this.pedidosService.upPedido(id_pedido, pedidoDTO);
  }
  /**
   * Actualiza el total de un pedido específico en la base de datos.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: PATCH /pedidos/actualizar-total/:id_pedido
   * @param id_pedido ID del pedido cuyo total se va a actualizar
   * @returns Pedido con el total actualizado
   */
  @Patch('actualizar-total/:id_pedido')
  async actualizarTotalPedido(
    @Param('id_pedido', ParseIntPipe) id_pedido: number,
  ) {
    return await this.pedidosService.actualizarTotalPedido(id_pedido);
  }
  /**
   * Elimina un producto de un pedido específico en la base de datos.
   * Esta es una API pública que no requiere autenticación.
   * Ruta: DELETE /pedidos/productos/:pedido_prod_id
   * @param pedido_prod_id ID del producto en el pedido que se va a eliminar
   * @returns Resultado de la eliminación del producto del pedido
   */
  @Delete('productos/:pedido_prod_id')
  async eliminarProductoDelPedido(
    @Param('pedido_prod_id', ParseIntPipe) pedido_prod_id: number,
  ) {
    return await this.pedidosService.eliminarProductoDelPedido(pedido_prod_id);
  }
}
