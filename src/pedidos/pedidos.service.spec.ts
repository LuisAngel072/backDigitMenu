import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

// Importa TODAS las entidades cuyos repositorios vas a simular
import { Pedidos, EstadoPedido } from './entities/pedidos.entity';
import { Pedidos_has_productos } from './entities/pedidos_has_productos.entity';
import { Pedidos_has_extrassel } from './entities/pedidos_has_extrasSel.entity';
import { Pedidos_has_ingrsel } from './entities/pedidos_has_ingrSel.entity';
import { Productos } from '../productos/entities/productos.entity';
import { Mesa } from '../mesas/entities/mesa.entity';
import { Extras } from '../extras/entities/extras.entity';
import { Ingredientes } from '../ingredientes/entities/ingredientes.entity';
import { Opciones } from '../opciones/entities/opciones.entity';
import { PedidosGateway } from './gateways/pedidos.gateway';

// 1. CREACIÓN DE MOCKS (Ahora completos)
const mockPedidosRepository = { find: jest.fn() };
const mockPHPrRepository = {
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
};
const mockPHExsRepository = { find: jest.fn() };
const mockPHIngrsRepository = { find: jest.fn() };
const mockProductosRepository = {}; // Lo dejamos vacío si no se usa directamente en la función probada
const mockMesaRepository = {};
const mockExtrasRepository = {};
const mockIngredientesRepository = {};
const mockOpcionesRepository = {};
const mockPedidosGateway = { actualizarPedido: jest.fn() };

describe('PedidosService', () => {
  let service: PedidosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidosService, // El servicio real que queremos probar
        // ✅ Proveemos TODOS los mocks necesarios
        {
          provide: getRepositoryToken(Pedidos),
          useValue: mockPedidosRepository,
        },
        {
          provide: getRepositoryToken(Pedidos_has_productos),
          useValue: mockPHPrRepository,
        },
        {
          provide: getRepositoryToken(Pedidos_has_extrassel),
          useValue: mockPHExsRepository,
        },
        {
          provide: getRepositoryToken(Pedidos_has_ingrsel),
          useValue: mockPHIngrsRepository,
        },
        {
          provide: getRepositoryToken(Productos),
          useValue: mockProductosRepository,
        },
        { provide: getRepositoryToken(Mesa), useValue: mockMesaRepository },
        { provide: getRepositoryToken(Extras), useValue: mockExtrasRepository },
        {
          provide: getRepositoryToken(Ingredientes),
          useValue: mockIngredientesRepository,
        },
        {
          provide: getRepositoryToken(Opciones),
          useValue: mockOpcionesRepository,
        },
        { provide: PedidosGateway, useValue: mockPedidosGateway },
      ],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los espías después de cada prueba
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // PRUEBA PARA getPedidosActivosConDetalles
  describe('getPedidosActivosConDetalles', () => {
    it('should return grouped active orders with their products for a given role', async () => {
      // ===== ARRANGE (Organizar) =====
      const mockProductosConPedidos = [
        {
          pedido_id: {
            id_pedido: 1,
            estado: EstadoPedido.no_pagado,
            no_mesa: { no_mesa: 1 },
          },
          producto_id: { id_prod: 1, nombre_prod: 'Pizza' },
          // ... resto de propiedades del producto
          extras: [],
          ingredientes: [],
        },
      ];

      mockPHPrRepository.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockProductosConPedidos),
      });

      // ===== ACT (Actuar) =====
      const result = await service.getPedidosActivosConDetalles('cocinero');

      // ===== ASSERT (Afirmar) =====
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      expect(result[0].pedidoId.id_pedido).toBe(1);
      expect(result[0].productos.length).toBe(1);
      expect(mockPHPrRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
    });
  });

  // PRUEBA PARA getExtrasIngrDeProducto
  describe('getExtrasIngrDeProducto', () => {
    it('should throw an HttpException if product in order is not found', async () => {
      // ===== ARRANGE (Organizar) =====
      mockPHPrRepository.findOne.mockResolvedValue(null);

      // ===== ACT & ASSERT (Actuar y Afirmar) =====
      await expect(service.getExtrasIngrDeProducto(999)).rejects.toThrow(
        new HttpException(
          `No se encontró el registro del producto en el pedido con id 999`,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});
