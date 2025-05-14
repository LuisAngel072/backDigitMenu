import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedidos } from './entities/pedidos.entity';
import { Repository, UpdateResult } from 'typeorm';
import {
  EstadoPedidoHasProductos,
  Pedidos_has_productos,
} from './entities/pedidos_has_productos.entity';
import { Pedidos_has_extrassel } from './entities/pedidos_has_extrasSel.entity';
import { Pedidos_has_ingrsel } from './entities/pedidos_has_ingrSel.entity';
import { CrPedidoDto } from './dtos/cr-pedido.dto';
import { Mesas } from 'src/mesas/entities/mesa.entity';
import { UpPedidoDto } from './dtos/up-pedido.dto';
import { CrPedidosHasProductosDTO } from './dtos/cr-pedidos_has_productos.dto';
import { Productos } from 'src/productos/entities/productos.entity';
import { Extras } from 'src/extras/entities/extras.entity';
import { Ingredientes } from 'src/ingredientes/entities/ingredientes.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';
import { Producto_extras_ingrSel } from './interfaces/producto_extras_ingr_sel.type';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedidos)
    private readonly pedidosRepository: Repository<Pedidos>,
    @InjectRepository(Pedidos_has_productos)
    private readonly p_h_prRepository: Repository<Pedidos_has_productos>,
    @InjectRepository(Pedidos_has_extrassel)
    private readonly p_h_exsRepository: Repository<Pedidos_has_extrassel>,
    @InjectRepository(Pedidos_has_ingrsel)
    private readonly p_h_ingrsRepository: Repository<Pedidos_has_ingrsel>,
    @InjectRepository(Productos)
    private readonly productosRepository: Repository<Productos>,
    @InjectRepository(Mesas)
    private readonly mesasRepository: Repository<Mesas>,
    @InjectRepository(Extras)
    private readonly extrasRepository: Repository<Extras>,
    @InjectRepository(Ingredientes)
    private readonly ingrRepository: Repository<Ingredientes>,
    @InjectRepository(Opciones)
    private readonly opcRepository: Repository<Opciones>,
  ) {}

  async getPedidos(): Promise<Pedidos[]> {
    try {
      const pedidosF = await this.pedidosRepository.find();

      if (!pedidosF || pedidosF.length === 0) {
        throw new HttpException(
          'No se encontrarorn pedidos',
          HttpStatus.NOT_FOUND,
        );
      }

      return pedidosF;
    } catch (error) {
      throw new HttpException(
        `Ocurrió un error al intentar obtener los pedidos: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductosPedido(
    id_pedido: number,
  ): Promise<Pedidos_has_productos[]> {
    try {
      const pedido = await this.pedidosRepository.findOne({
        where: { id_pedido: id_pedido },
      });
      if (!pedido) {
        throw new HttpException(
          'No se encontró el pedido',
          HttpStatus.NOT_FOUND,
        );
      }
      const p_h_pr = await this.p_h_prRepository.find({
        where: { pedido_id: pedido },
        relations: ['opcion_id'],
      });
      if (!p_h_pr || p_h_pr.length === 0) {
        throw new HttpException(
          'No se encontraron productos en el pedido',
          HttpStatus.NOT_FOUND,
        );
      }

      return p_h_pr;
    } catch (error) {
      throw new HttpException(
        `Ocurrió un error al intentar obtener los productos del pedido: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene todos los datos que tiene un producto en un pedido y los elementos necesarios
   * para su preparación, como los extras, opcion e ingredientes, revise la interfaz producto_extras_ingr_sel
   * que están tanto en el front como en el back.
   * @param p_h_pr_id Llave primaria del registro de la tabla pedidos_has_productos NO id_producto
   * @returns Producto_extras_ingrSel
   */
  async getExtrasIngrDeProducto(
    p_h_pr_id: number,
  ): Promise<Producto_extras_ingrSel> {
    try {
      const p_h_prF: Pedidos_has_productos =
        await this.p_h_prRepository.findOne({
          where: { pedido_prod_id: p_h_pr_id },
          relations: ['opcion_id'],
        });
      if (!p_h_prF) {
        throw new HttpException(
          'Producto en pedido no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }
      const extrasSel = await this.p_h_exsRepository
        .createQueryBuilder('e')
        .leftJoinAndSelect('e.extra_id', 'extra')
        .where('e.pedido_prod_id = :id', { id: p_h_pr_id })
        .getMany();

      const ingrSel = await this.p_h_ingrsRepository
        .createQueryBuilder('i')
        .leftJoinAndSelect('i.ingrediente_id', 'ingrediente')
        .where('i.pedido_prod_id = :id', { id: p_h_pr_id })
        .getMany();

      console.log(extrasSel);
      console.log(ingrSel);
      const extras: Extras[] = extrasSel.map((extra) => extra.extra_id);
      const ingredientes: Ingredientes[] = ingrSel.map(
        (ingrediente) => ingrediente.ingrediente_id,
      );
      const body: Producto_extras_ingrSel = {
        pedido_id: p_h_prF.pedido_id,
        producto_id: p_h_prF.producto_id,
        opcion_id: p_h_prF.opcion_id,
        estado: p_h_prF.estado,
        precio: p_h_prF.precio,
        extras: extras,
        ingredientes: ingredientes,
      };

      return body;
    } catch (error) {
      throw new HttpException(
        `Ocurrió un error al intentar obtener los datos del producto sobre el pedido: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Esta función es llamada cuando el cliente ingresa a la aplicación.
   * Una vez entrado en la aplicación (oprimió el botón de empezar),
   * se crea un pedido
   * @param pedidoDTO número de mesa donde corresponde el pedido
   * @returns Pedido creado y listo para que aparezca en meseros y cocina
   */
  async crearPedido(pedidoDTO: CrPedidoDto): Promise<Pedidos> {
    try {
      const mesa = await this.mesasRepository.findOne({
        where: { no_mesa: pedidoDTO.no_mesa },
      });
      if (!mesa) {
        throw new HttpException('No se encontró la mesa', HttpStatus.NOT_FOUND);
      }
      const pedido = { no_mesa: mesa };
      const pedidoCr = this.pedidosRepository.create(pedido);
      return await this.pedidosRepository.save(pedidoCr);
    } catch (error) {
      throw new HttpException(
        `Ocurrió un error al intentar crear el pedido: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  /**
   * Esta función será utilizada en dos casos:
   * Cuando el usuario comience agregar productos en el pedido, presionando el botón de
   * "Finalizar pedido", actualizando el total según los productos con los extras, opciones
   * e ingredientes seleccionados.
   * Cuando el usuario pague la cuenta y este pedido sea marcado como pagado.
   * @param id_pedido Llave primaria del pedido a actualizar
   * @param pedidoDTO Precio total de pedido de la mesa y/o cambio de estado de iniciado a pagado
   * @returns pedido actualizado
   */
  async upPedido(
    id_pedido: number,
    pedidoDTO: UpPedidoDto,
  ): Promise<UpdateResult> {
    try {
      const pedido = await this.pedidosRepository.findOne({
        where: { id_pedido: id_pedido },
      });
      if (!pedido) {
        throw new HttpException(
          `No se encontró el pedido a actualizar con id ${id_pedido}`,
          HttpStatus.NOT_FOUND,
        );
      }
      const pedidoCr = this.pedidosRepository.create(pedidoDTO);
      return await this.pedidosRepository.update(id_pedido, pedidoCr);
    } catch (error) {
      throw new HttpException(
        `Ocurrió un error al intentar actualizar el pedido con id ${id_pedido}: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Esta función es llamada cuando el cliente da clic en "Finalizar pedido" o "Agregar al pedido"
   * (esto cuando ya haya presionado clic en finalizar pedido, pero decicidió agregar
   * más productos a la cuenta). En el front, debe ser ejecutada mediante un for, es decir,
   * hacer tantas peticiones según los productos seleccionados para el pedido.
   * Esta función busca el pedido, opcion y producto por medio de las id's enviadas y registra
   * si la función las encuentra. Si el cliente seleccionó extras o ingredientes (por defecto
   * siempre vienen seleccionados todos), también realizará los registros en
   * pedidos_has_extrassel y pedidos_has_ingrsel según el nuevo registro en pedidos_has_productos
   * y los id's de los extras o ingredientes que se manden en la petición.
   * @param p_h_prDTO Incluye id del producto (producto_id), id del pedido (pedido_id), opcion
   * seleccionada (opcion_id), precio subtotal (unicamente del producto resultante), extras seleccionados
   * (extras [si los hay]) e ingredientes seleccionados (ingredientes [todos seleccionados por defecto,
   * el cliente o mesero decide cual deseleccionar])
   * @returns Registro en pedidos_has_productos
   */
  async addProductoAPedido(
    p_h_prDTO: CrPedidosHasProductosDTO,
  ): Promise<Pedidos_has_productos> {
    try {
      const extras: Extras[] = [];
      const ingrs: Ingredientes[] = [];

      const pedidoF = await this.pedidosRepository.findOne({
        where: { id_pedido: p_h_prDTO.pedido_id },
      });
      const productoF = await this.productosRepository.findOne({
        where: { id_prod: p_h_prDTO.producto_id },
      });
      const opcionF = await this.opcRepository.findOne({
        where: { id_opcion: p_h_prDTO.opcion_id },
      });

      if (!pedidoF) {
        throw new HttpException(
          `No se encontró el pedido con id ${p_h_prDTO.pedido_id}`,
          HttpStatus.NOT_FOUND,
        );
      }

      if (!productoF) {
        throw new HttpException(
          `No se encontró el producto con id ${p_h_prDTO.producto_id}`,
          HttpStatus.NOT_FOUND,
        );
      }

      if (!opcionF) {
        throw new HttpException(
          `No se encontró la opción del producto con id ${p_h_prDTO.opcion_id}`,
          HttpStatus.NOT_FOUND,
        );
      }
      const body = {
        pedido_id: pedidoF,
        producto_id: productoF,
        opcion_id: opcionF,
        precio: p_h_prDTO.precio,
      };
      const p_h_prC = await this.p_h_prRepository.create(body);
      const p_h_prS = await this.p_h_prRepository.save(p_h_prC);

      if (p_h_prDTO.extras.length > 0) {
        for (const p_h_extra of p_h_prDTO.extras) {
          const extraF = await this.extrasRepository.findOne({
            where: { id_extra: p_h_extra },
          });
          if (!extraF) {
            throw new HttpException(
              `No se encontró el extra seleccionado con id ${p_h_extra}`,
              HttpStatus.NOT_FOUND,
            );
          }
          extras.push(extraF);
        }
        for (const extra of extras) {
          const body = {
            pedido_prod_id: p_h_prS,
            extra_id: extra,
            precio: extra.precio,
          };
          const p_h_exSC = this.p_h_exsRepository.create(body);
          await this.p_h_exsRepository.save(p_h_exSC);
        }
      }

      if (p_h_prDTO.ingr.length > 0) {
        for (const p_h_ingr of p_h_prDTO.ingr) {
          const ingrF = await this.ingrRepository.findOne({
            where: { id_ingr: p_h_ingr },
          });
          if (!ingrF) {
            throw new HttpException(
              `No se encontró el extra seleccionado con id ${p_h_ingr}`,
              HttpStatus.NOT_FOUND,
            );
          }
          ingrs.push(ingrF);
        }

        for (const ingr of ingrs) {
          const body = {
            pedido_prod_id: p_h_prS,
            ingrediente_id: ingr,
            precio: ingr.precio,
          };
          const p_h_ingrSC = this.p_h_ingrsRepository.create(body);
          await this.p_h_ingrsRepository.save(p_h_ingrSC);
        }
      }

      return p_h_prS;
    } catch (error) {
      throw new HttpException(
        `Ocurrió un error al intentar agregar un producto al pedido con id ${p_h_prDTO.pedido_id}: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Cambia el estado de un producto en pedidos_has_productos si el cocinero ya preparó
   * el pedido (preparado), si el mesero entregó el producto (entregado) o si el cliente
   * pago el pedido (Pagado).
   * @param pedido_prod_id Producto al cual se le va a cambiar el estado en el pedido
   * @param estado Estado correspondiente a actualizar (tener enum registrado en el enu)
   * @returns Actualización de estado en pedidos_has_productos
   */
  async cambiarEstado(
    pedido_prod_id: number,
    estado: EstadoPedidoHasProductos,
  ): Promise<UpdateResult> {
    try {
      const p_h_pr = await this.p_h_prRepository.findOne({
        where: { pedido_prod_id: pedido_prod_id },
      });

      if (!p_h_pr) {
        throw new HttpException(
          `No se encontró registro del producto en el pedido con id ${pedido_prod_id}`,
          HttpStatus.NOT_FOUND,
        );
      }

      const p_h_prU = await this.p_h_prRepository.update(pedido_prod_id, {
        estado: estado,
      });

      return p_h_prU;
    } catch (error) {
      throw new HttpException(
        `Ocurrió un error al intentar cambiar de estado
         un producto al pedido con id ${pedido_prod_id}: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
