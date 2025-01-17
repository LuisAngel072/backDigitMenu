import { Test, TestingModule } from '@nestjs/testing';
import { TelefonoService } from './telefono.service';

describe('TelefonoService', () => {
  let service: TelefonoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelefonoService],
    }).compile();

    service = module.get<TelefonoService>(TelefonoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
