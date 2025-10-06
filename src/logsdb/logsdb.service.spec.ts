import { Test, TestingModule } from '@nestjs/testing';
import { LogsdbService } from './logsdb.service';

describe('LogsdbService', () => {
  let service: LogsdbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsdbService],
    }).compile();

    service = module.get<LogsdbService>(LogsdbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
