import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoriasService } from './sub-categorias.service';

describe('SubCategoriasService', () => {
  let service: SubCategoriasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubCategoriasService],
    }).compile();

    service = module.get<SubCategoriasService>(SubCategoriasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
