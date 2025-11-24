// src/mesas/mesas.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MesasController } from './mesas.controller';
import { MesasService } from './mesas.service';
import { NotFoundException } from '@nestjs/common';

describe('MesasController', () => {
  let controller: MesasController;
  let service: MesasService;

  const mockMesasService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MesasController],
      providers: [
        {
          provide: MesasService,
          useValue: mockMesasService,
        },
      ],
    }).compile();

    controller = module.get<MesasController>(MesasController);
    service = module.get<MesasService>(MesasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of mesas', async () => {
      const result = [{ id_mesa: 1, no_mesa: 1, qr_code_url: 'url1' }];
      mockMesasService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockMesasService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single mesa', async () => {
      const result = { id_mesa: 1, no_mesa: 1, qr_code_url: 'url1' };
      mockMesasService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
      expect(mockMesasService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when mesa does not exist', async () => {
      mockMesasService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockMesasService.findOne).toHaveBeenCalledWith(999);
    });
  });
});
