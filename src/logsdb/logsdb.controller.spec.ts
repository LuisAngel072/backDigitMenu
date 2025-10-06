import { Test, TestingModule } from '@nestjs/testing';
import { LogsdbController } from './logsdb.controller';

describe('LogsdbController', () => {
  let controller: LogsdbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsdbController],
    }).compile();

    controller = module.get<LogsdbController>(LogsdbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
