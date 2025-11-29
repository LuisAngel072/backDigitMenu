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
import { promises as fs } from 'fs';
import { join } from 'path';

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

  /**
   * Obtiene todos los productos con sus relaciones de categorias
   * @returns Productos[] + Categoria y Subcategoria
   */
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
  /**
   * Obtiene el registro de un producto en específico
   * @param id_prod id del producto a consultar
   * @returns objeto Productos
   */
  async obtenerProducto(id_prod: number) {
    try {
      const producto = await this.productosRepository.findOne({
        where: { id_prod },
        relations: ['sub_cat_id', 'sub_cat_id.categoria_id'],
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

  /**
   * Obtiene los extras asociados a un producto específico.
   * @param id_prod - El ID del producto del que se quieren obtener los extras.
   * @returns Una promesa que se resuelve en un arreglo de relaciones 'Productos_has_extras'.
   */
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

  /**
   * Obtiene los ingredientes asociados a un producto específico.
   * @param id_prod - El ID del producto para consultar sus ingredientes.
   * @returns Un arreglo de relaciones 'Productos_has_ingredientes'.
   */
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

  /**
   * Obtiene las opciones asociadas a un producto específico.
   * @param id_prod - El ID del producto para consultar sus opciones.
   * @returns Un arreglo de relaciones 'Productos_has_opciones'.
   */
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

  /**
   * Crea un nuevo producto y establece sus relaciones con extras, ingredientes y opciones.
   * @param prodDTO - DTO con los datos para crear el producto y sus relaciones.
   */
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

  /**
   * Actualiza las propiedades de un producto y elimina las relaciones para
   * agregar las nuevas dadas por el DTO.
   * Si la imagen se va a cambiar, primero debe subir la imagen y luego
   * pasar la ruta en el DTO. Eliminar el archivo anterior y enlazar la nueva ruta
   * al producto actualizado.
   * @param id_prod Id del producto a actualizar
   * @param prodDto Revisar el DTO de los productos, debe contener todas las relaciones
   * de extras, ingredientes y opciones
   * @returns producto actualizado
   */
  async upProducto(id_prod: number, prodDto: UpProductosDto) {
    try {
      const producto = await this.productosRepository.findOneBy({ id_prod });

      if (!producto) {
        throw new HttpException(
          'No se encontró el producto en la bd',
          HttpStatus.NOT_FOUND,
        );
      }

      // Actualizar imagen si se proporciona una nueva
      if (prodDto.img_prod !== undefined) {
        await this.upImgProducto(id_prod, prodDto.img_prod);
      }

      // Actualizar propiedades directas del producto
      const { extras, ingredientes, opciones, sub_cat_id, ...datosProducto } =
        prodDto;

      const datosAActualizar: any = { ...datosProducto };

      if (sub_cat_id) {
        const subCategoria = await this.subCategoriasRepository.findOneBy({
          id_subcat: sub_cat_id,
        });
        if (!subCategoria) {
          throw new HttpException(
            'Subcategoría no encontrada',
            HttpStatus.NOT_FOUND,
          );
        }
        datosAActualizar.sub_cat_id = { id_subcat: sub_cat_id };
      }

      await this.productosRepository.update({ id_prod }, datosAActualizar);

      // Actualizar relaciones
      if (extras) {
        // Eliminar relaciones de extras anteriores
        await this.prod_has_extras.delete({ producto_id: { id_prod } });
        // Crear las nuevas relaciones
        for (const extra of extras) {
          const relExtra = this.prod_has_extras.create({
            producto_id: producto,
            extra_id: extra,
            precio: extra.precio,
          });
          await this.prod_has_extras.save(relExtra);
        }
      }

      if (ingredientes) {
        // Eliminar relaciones de ingredientes anteriores
        await this.prod_has_ingr.delete({ producto_id: { id_prod } });
        // Crear las nuevas relaciones
        for (const ingr of ingredientes) {
          const relIngr = this.prod_has_ingr.create({
            producto_id: producto,
            ingrediente_id: ingr,
            precio: ingr.precio,
          });
          await this.prod_has_ingr.save(relIngr);
        }
      }

      if (opciones) {
        // Eliminar relaciones de opciones anteriores
        await this.prod_has_opc.delete({ producto_id: { id_prod } });
        // Crear las nuevas relaciones
        for (const opc of opciones) {
          const relOpc = this.prod_has_opc.create({
            producto_id: producto,
            opcion_id: opc,
            precio: opc.porcentaje,
          });
          await this.prod_has_opc.save(relOpc);
        }
      }

      return await this.obtenerProducto(id_prod);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Ocurrió un error al intentar actualizar el producto',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Elimina un producto, sus relaciones y el archivo de imagen asociado.
   * @param id_prod - El ID del producto a eliminar.
   * @returns El resultado de la operación de eliminación de la base de datos.
   */
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
      const filePath = join(process.cwd(), 'uploads', producto.img_prod);
      try {
        await fs.unlink(filePath);
        console.log('Archivo eliminado:', filePath);
      } catch (err) {
        console.error('Error al eliminar el archivo:', err);
        // Puedes decidir si lanzar error o continuar
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

  /**
   * Actualiza la imagen de un producto. Elimina la imagen anterior si existe una nueva.
   * @param id_prod - El ID del producto a actualizar.
   * @param img_prod - La nueva ruta de la imagen del producto.
   * @returns El resultado de la operación de actualización.
   */
  async upImgProducto(id_prod: number, img_prod: string) {
    try {
      const producto = await this.productosRepository.findOne({
        where: { id_prod: id_prod },
      });
      if (!producto) {
        throw new HttpException(
          'No se encontró el producto en la bd',
          HttpStatus.NOT_FOUND,
        );
      }
      if (img_prod) {
        const prevRutaImg = producto.img_prod;
        // Si la ruta nueva es distinta a la anterior, elimina el archivo antiguo
        if (prevRutaImg && prevRutaImg !== img_prod) {
          // Construir la ruta completa al archivo (asegúrate de que la carpeta 'uploads' sea la correcta)
          const filePath = join(process.cwd(), 'uploads', prevRutaImg);
          try {
            await fs.unlink(filePath);
            console.log('Archivo eliminado:', filePath);
          } catch (err) {
            console.error('Error al eliminar el archivo:', err);
            // Puedes decidir si lanzar error o continuar
          }
        }
      }

      return await this.productosRepository.update(id_prod, {
        img_prod: img_prod,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Ocurrió un error al intentar actualizar la imagen del producto',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
