import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pedidos_has_productos } from './entities/pedidos_has_productos.entity';

import { Pedidos } from './entities/pedidos.entity';
import { Pedidos_has_extrassel } from './entities/pedidos_has_extrasSel.entity';
import { Pedidos_has_ingrsel } from './entities/pedidos_has_ingrSel.entity';
import { Productos } from '../productos/entities/productos.entity';
import { Mesa } from '../mesas/entities/mesa.entity';
import { Extras } from '../extras/entities/extras.entity';
import { Ingredientes } from '../ingredientes/entities/ingredientes.entity';
import { Opciones } from '../opciones/entities/opciones.entity';
import { PedidosGateway } from './gateways/pedidos.gateway';

describe('PedidosService', () => {
  let service: PedidosService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockPHPrRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    findOne: jest.fn(),
  };

  const mockRepository = { find: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidosService,
        {
          provide: getRepositoryToken(Pedidos_has_productos),
          useValue: mockPHPrRepository,
        },
        { provide: getRepositoryToken(Pedidos), useValue: mockRepository },
        {
          provide: getRepositoryToken(Pedidos_has_extrassel),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Pedidos_has_ingrsel),
          useValue: mockRepository,
        },
        { provide: getRepositoryToken(Productos), useValue: mockRepository },
        { provide: getRepositoryToken(Mesa), useValue: mockRepository },
        { provide: getRepositoryToken(Extras), useValue: mockRepository },
        { provide: getRepositoryToken(Ingredientes), useValue: mockRepository },
        { provide: getRepositoryToken(Opciones), useValue: mockRepository },
        { provide: PedidosGateway, useValue: {} },
      ],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
  });

  const generarDatosMasivos = (
    cantidadProductos: number,
    cantidadPedidos: number,
  ) => {
    const datos = [];
    for (let i = 0; i < cantidadProductos; i++) {
      const pedidoId = (i % cantidadPedidos) + 1;
      datos.push({
        pedido_prod_id: i + 1000,
        estado: 'Sin preparar',
        precio: '150.00',
        pedido_id: {
          id_pedido: pedidoId,
          fecha_pedido: new Date(),
          total: 1500,
          no_mesa: { no_mesa: 1, id_mesa: 1 },
          estado: 'No pagado',
        },
        producto_id: { id_prod: 10, nombre_prod: `Producto ${i}` },
        opcion_id: { id_opcion: 5, nombre_opcion: 'Grande' },
        extras: [],
        ingredientes: [],
      });
    }
    return datos;
  };

  describe('Pruebas de Rendimiento (Stress Test)', () => {
    it('⚠️ DEBE procesar 50 peticiones concurrentes con carga de datos en < 200ms promedio', async () => {
      const cargaPesada = generarDatosMasivos(500, 50);
      mockQueryBuilder.getMany.mockResolvedValue(cargaPesada);

      const peticionesConcurrentes = 50;
      const promesas = [];

      const inicio = performance.now();

      for (let i = 0; i < peticionesConcurrentes; i++) {
        promesas.push(service.getPedidosActivosConDetalles('mesero'));
      }

      await Promise.all(promesas);

      const fin = performance.now();
      const tiempoTotal = fin - inicio;
      const tiempoPromedio = tiempoTotal / peticionesConcurrentes;

      console.log(`\n📊 REPORTE DE RENDIMIENTO:`);
      console.log(`   - Peticiones concurrentes: ${peticionesConcurrentes}`);
      console.log(`   - Productos simulados: 500`);
      console.log(`   - Tiempo Total: ${tiempoTotal.toFixed(2)} ms`);
      console.log(
        `   - Promedio por petición: ${tiempoPromedio.toFixed(2)} ms`,
      );

      expect(tiempoPromedio).toBeLessThan(200);
    });
  });
});
