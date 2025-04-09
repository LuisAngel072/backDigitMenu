import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Productos } from './entities/productos.entity';
import { Repository } from 'typeorm';
import { Productos_has_extras } from './entities/productos_has_extras.entity';
import { Productos_has_ingredientes } from './entities/productos_has_ingredientes.entity';
import { Productos_has_opciones } from './entities/productos_has_opciones.entity';
import { CrProductosDto } from './dtos/crear-producto.dto';
import { UpProductosDto } from './dtos/up-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Productos)
    private readonly productosRepository: Repository<Productos>,
    @InjectRepository(Productos_has_extras)
    private readonly prod_has_extras: Repository<Productos_has_extras>,
    @InjectRepository(Productos_has_ingredientes)
    private readonly prod_has_ingr: Repository<Productos_has_ingredientes>,
    @InjectRepository(Productos_has_opciones)
    private readonly prod_has_opc: Repository<Productos_has_opciones>,
  ) {}

  async obtenerProductos() {
    try {
      const productos = this.productosRepository.find();

      if (!productos) {
        throw new HttpException(
          'No existen productos en la bd',
          HttpStatus.NOT_FOUND,
        );
      }

      return productos;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Ocurrió un error al intentar obtener los productos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async obtenerProducto(id_producto: number) {
    try {
      const producto = await this.productosRepository.findOne({
        where: { id_producto },
      });
      if (!producto) {
        throw new HttpException(
          'No se encontró el producto',
          HttpStatus.NOT_FOUND,
        );
      }
      return producto;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Algo salió mal al intentar consultar un producto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async obtenerExtrasDeProducto(id_producto: number) {
    try {
      const producto = await this.productosRepository.findOne({
        where: { id_producto: id_producto },
      });
      const extras = await this.prod_has_extras.find({
        where: { producto_id: producto },
        relations: ['extra_id'],
      });

      if (!extras) {
        throw new HttpException(
          'No se encontraron extras en el producto',
          HttpStatus.NOT_FOUND,
        );
      }
      return extras;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Ocurrió un error al intentar obtener los extras de un producto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async obtenerIngredientesDeProducto(id_producto: number) {
    try {
      const producto = await this.productosRepository.findOne({
        where: { id_producto: id_producto },
      });
      const ingredientes = await this.prod_has_ingr.find({
        where: { producto_id: producto },
        relations: ['ingrediente_id'],
      });

      if (!ingredientes) {
        throw new HttpException(
          'No se encontraron ingredientes en el producto',
          HttpStatus.NOT_FOUND,
        );
      }
      return ingredientes;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Ocurrió un error al intentar obtener los ingredientes de un producto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async obtenerOpcionesDeProducto(id_producto: number) {
    try {
      const producto = await this.productosRepository.findOne({
        where: { id_producto: id_producto },
      });
      const opciones = await this.prod_has_opc.find({
        where: { producto_id: producto },
        relations: ['opcion_id'],
      });

      if (!opciones) {
        throw new HttpException(
          'No se encontraron opciones en el producto',
          HttpStatus.NOT_FOUND,
        );
      }
      return opciones;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Ocurrió un error al intentar obtener las opciones de un producto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async crearProducto(prodDTO: CrProductosDto) {
    try {
      const producto = {
        nombre_prod: prodDTO.nombre_prod,
        descripcion: prodDTO.descripcion,
        precio: prodDTO.precio,
        img_prod: prodDTO.img_prod,
        sub_cat_id: prodDTO.sub_cat_id,
      };

      const prodCr = this.productosRepository.create(producto);

      const prodS = await this.productosRepository.save(prodCr);

      if (prodDTO.extras) {
        for (let i = 0; i < prodDTO.extras.length; i++) {
          const p_h_e = {
            producto_id: prodS,
            extra_id: prodDTO.extras[i],
          };
          let pheC = this.prod_has_extras.create(p_h_e);
          await this.prod_has_extras.save(pheC);
        }
      }
      if (prodDTO.ingredientes) {
        for (let i = 0; i < prodDTO.ingredientes.length; i++) {
          const p_h_i = {
            producto_id: prodS,
            ingrediente_id: prodDTO.ingredientes[i],
          };
          let phiC = this.prod_has_ingr.create(p_h_i);
          await this.prod_has_ingr.save(phiC);
        }
      }
      if (prodDTO.opciones) {
        for (let i = 0; i < prodDTO.opciones.length; i++) {
          const p_h_o = {
            producto_id: prodS,
            extra_id: prodDTO.opciones[i],
          };
          let phoC = this.prod_has_opc.create(p_h_o);
          await this.prod_has_opc.save(phoC);
        }
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Ocurrió un error al intentar registrar el producto',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async upProducto(id_producto: number, prodDto: UpProductosDto) {
    try {
      let producto = await this.productosRepository.findOne({
        where: { id_producto: id_producto },
      });

      if (!producto) {
        throw new HttpException(
          'No se encontró el producto en la bd',
          HttpStatus.NOT_FOUND,
        );
      }
      //Actualiza individualmente cada propiedad del producto
      producto.nombre_prod = prodDto.nombre_prod
        ? prodDto.nombre_prod
        : producto.nombre_prod;

      producto.descripcion = prodDto.descripcion
        ? prodDto.descripcion
        : producto.descripcion;

      producto.img_prod = prodDto.img_prod
        ? prodDto.img_prod
        : producto.img_prod;

      producto.precio = prodDto.precio ? prodDto.precio : producto.precio;

      producto.sub_cat_id = prodDto.sub_cat_id
        ? prodDto.sub_cat_id
        : producto.sub_cat_id;

      let relacionesEliminar = prodDto.extras.length; //Contabiliza las relaciones a eliminar
      let i = 0;
      /*
        Mapea sobre todas las relaciones dadas por el DTO para actualizar el producto.
        Por cada relación actualizada, disminuye el valor de relacionesEliminar, porque significa
        eliminar un registro o relación menos.
         */
      for (let extra of prodDto.extras) {
        producto.prod_has_extra_id[i].extra_id = extra;
        i++;
        relacionesEliminar--;
      }
      /*
        Elimina las relaciones sobrantes respecto prodDto sobre el producto a actualizar.
        Por ejemplo: Si el producto tenía 4 extras y en la actualización se deseleccionó
        un extra, brindando solo 3 extras, relacionesEliminar tendrá valor de 1.
        El for buscara la relación que no coincide con el DTO de entrada y eliminará la
        relación.
        */
      for (let j = 0; j < relacionesEliminar; j++) {
        //Busca una relación posible a eliminar
        let relEl = await this.prod_has_extras.findOne({
          where: {
            producto_id: producto,
            extra_id: producto.prod_has_extra_id[j].extra_id,
          },
        });
        if (relEl.extra_id !== prodDto.extras[j]) {
          await this.prod_has_extras.delete(relEl.producto_extra_id);
        }
      }

      relacionesEliminar = prodDto.ingredientes.length; //Contabiliza las relaciones a eliminar
      i = 0;

      for (let ingr of prodDto.ingredientes) {
        producto.prod_has_ingr_id[i].ingrediente_id = ingr;
        i++;
        relacionesEliminar--;
      }

      for (let j = 0; j < relacionesEliminar; j++) {
        //Busca una relación posible a eliminar
        let relEl = await this.prod_has_ingr.findOne({
          where: {
            producto_id: producto,
            ingrediente_id: producto.prod_has_ingr_id[j].ingrediente_id,
          },
        });
        if (relEl.ingrediente_id !== prodDto.ingredientes[j]) {
          await this.prod_has_ingr.delete(relEl.prod_ingr_id);
        }
      }

      relacionesEliminar = prodDto.opciones.length; //Contabiliza las relaciones a eliminar
      i = 0;

      for (let opc of prodDto.opciones) {
        producto.prod_has_opc_id[i].opcion_id = opc;
        i++;
        relacionesEliminar--;
      }

      for (let j = 0; j < relacionesEliminar; j++) {
        //Busca una relación posible a eliminar
        let relEl = await this.prod_has_opc.findOne({
          where: {
            producto_id: producto,
            opcion_id: producto.prod_has_opc_id[j].opcion_id,
          },
        });
        if (relEl.opcion_id !== prodDto.opciones[j]) {
          await this.prod_has_opc.delete(relEl.producto_opc_id);
        }
      }

      return await this.productosRepository.update(id_producto, producto);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Ocurrió un error al intentar actualizar el producto',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delProducto(id_producto: number) {
    try {
      const producto = await this.productosRepository.findOne({
        where: { id_producto: id_producto },
      });
      const p_h_e = await this.prod_has_extras.find({
        where: { producto_id: producto },
      });
      const p_h_i = await this.prod_has_ingr.find({
        where: { producto_id: producto },
      });
      const p_h_o = await this.prod_has_opc.find({
        where: { producto_id: producto },
      });

      for (let phe of p_h_e) {
        await this.prod_has_extras.delete(phe.producto_extra_id);
      }
      for (let phi of p_h_i) {
        await this.prod_has_ingr.delete(phi.prod_ingr_id);
      }
      for (let opc of p_h_o) {
        await this.prod_has_ingr.delete(opc.producto_opc_id);
      }

      return await this.productosRepository.delete(producto);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Ocurrió un error al intentar eliminar el producto',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
