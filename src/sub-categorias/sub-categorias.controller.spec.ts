import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoriasController } from './sub-categorias.controller';

describe('SubCategoriasController', () => {
  let controller: SubCategoriasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCategoriasController],
    }).compile();

    controller = module.get<SubCategoriasController>(SubCategoriasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
