import { Test, TestingModule } from '@nestjs/testing';
import { NssService } from './nss.service';

describe('NssService', () => {
  let service: NssService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NssService],
    }).compile();

    service = module.get<NssService>(NssService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
