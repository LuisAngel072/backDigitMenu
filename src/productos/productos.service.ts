import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Productos } from './entities/productos.entity';
import { Repository } from 'typeorm';
import { Productos_has_extras } from './entities/productos_has_extras.entity';
import { Productos_has_ingredientes } from './entities/productos_has_ingredientes.entity';
import { Productos_has_opciones } from './entities/productos_has_opciones.entity';
import { CrProductosDto } from './dtos/crear-producto.dto';
import { UpProductosDto } from './dtos/up-producto.dto';
import { Sub_categorias } from 'src/sub-categorias/entities/sub_categorias.entity';

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
    @InjectRepository(Sub_categorias)
    private readonly subCategoriasRepository: Repository<Sub_categorias>,
  ) {}

  async obtenerProductos() {
    try {
      const productos = this.productosRepository.find({
        relations: ['sub_cat_id', 'sub_cat_id.categoria_id'],
      });

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
  async obtenerProducto(id_prod: number) {
    try {
      const producto = await this.productosRepository.findOne({
        where: { id_prod },
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

  async obtenerExtrasDeProducto(id_prod: number) {
    try {
      const producto = await this.productosRepository.findOne({
        where: { id_prod: id_prod },
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

  async obtenerIngredientesDeProducto(id_prod: number) {
    try {
      const producto = await this.productosRepository.findOne({
        where: { id_prod: id_prod },
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

  async obtenerOpcionesDeProducto(id_prod: number) {
    try {
      const producto = await this.productosRepository.findOne({
        where: { id_prod: id_prod },
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
      const sub_cat_id = await this.subCategoriasRepository.findOne({
        where: { id_subcat: prodDTO.sub_cat_id },
      });
      // 1) Crear y guardar el producto principal
      const prodEntity = this.productosRepository.create({
        nombre_prod: prodDTO.nombre_prod,
        descripcion: prodDTO.descripcion,
        precio: prodDTO.precio,
        img_prod: prodDTO.img_prod,
        sub_cat_id: sub_cat_id,
      });
      const prodS = await this.productosRepository.save(prodEntity);
      const prodGuardado = await this.productosRepository.findOne({
        where: { id_prod: prodS.id_prod },
      });

      // 2) Relación Extras
      if (prodDTO.extras) {
        for (const extra of prodDTO.extras) {
          const relExtra = this.prod_has_extras.create({
            producto_id: prodGuardado,
            extra_id: extra,
            precio: extra.precio,
          });
          await this.prod_has_extras.save(relExtra);
        }
      }

      // 3) Relación Ingredientes
      if (prodDTO.ingredientes) {
        for (const ingr of prodDTO.ingredientes) {
          const relIngr = this.prod_has_ingr.create({
            producto_id: prodGuardado,
            ingrediente_id: ingr,
            precio: ingr.precio,
          });
          await this.prod_has_ingr.save(relIngr);
        }
      }

      // 4) Relación Opciones
      if (prodDTO.opciones) {
        for (const opc of prodDTO.opciones) {
          const relOpc = this.prod_has_opc.create({
            producto_id: prodGuardado,
            opcion_id: opc,
            precio: opc.porcentaje,
          });
          await this.prod_has_opc.save(relOpc);
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

  async upProducto(id_prod: number, prodDto: UpProductosDto) {
    try {
      const producto = await this.productosRepository.findOne({
        where: { id_prod: id_prod },
      });
      const sub_cat_id = await this.subCategoriasRepository.findOne({
        where: { id_subcat: prodDto.sub_cat_id },
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

      producto.sub_cat_id = sub_cat_id ? sub_cat_id : producto.sub_cat_id;

      let relacionesEliminar = prodDto.extras.length; //Contabiliza las relaciones a eliminar
      let i = 0;
      /*
        Mapea sobre todas las relaciones dadas por el DTO para actualizar el producto.
        Por cada relación actualizada, disminuye el valor de relacionesEliminar, porque significa
        eliminar un registro o relación menos.
         */
      for (const extra of prodDto.extras) {
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
        const relEl = await this.prod_has_extras.findOne({
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

      for (const ingr of prodDto.ingredientes) {
        producto.prod_has_ingr_id[i].ingrediente_id = ingr;
        i++;
        relacionesEliminar--;
      }

      for (let j = 0; j < relacionesEliminar; j++) {
        //Busca una relación posible a eliminar
        const relEl = await this.prod_has_ingr.findOne({
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

      for (const opc of prodDto.opciones) {
        producto.prod_has_opc_id[i].opcion_id = opc;
        i++;
        relacionesEliminar--;
      }

      for (let j = 0; j < relacionesEliminar; j++) {
        //Busca una relación posible a eliminar
        const relEl = await this.prod_has_opc.findOne({
          where: {
            producto_id: producto,
            opcion_id: producto.prod_has_opc_id[j].opcion_id,
          },
        });
        if (relEl.opcion_id !== prodDto.opciones[j]) {
          await this.prod_has_opc.delete(relEl.producto_opc_id);
        }
      }

      return await this.productosRepository.update(id_prod, producto);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Ocurrió un error al intentar actualizar el producto',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delProducto(id_prod: number) {
    try {
      const producto = await this.productosRepository.findOne({
        where: { id_prod: id_prod },
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

      for (const phe of p_h_e) {
        await this.prod_has_extras.delete(phe.producto_extra_id);
      }
      for (const phi of p_h_i) {
        await this.prod_has_ingr.delete(phi.prod_ingr_id);
      }
      for (const opc of p_h_o) {
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
