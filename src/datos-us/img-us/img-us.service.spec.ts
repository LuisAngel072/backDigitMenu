import { Test, TestingModule } from '@nestjs/testing';
import { ImgUsService } from './img-us.service';

describe('ImgUsService', () => {
  let service: ImgUsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImgUsService],
    }).compile();

    service = module.get<ImgUsService>(ImgUsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
