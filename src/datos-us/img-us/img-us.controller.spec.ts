import { Test, TestingModule } from '@nestjs/testing';
import { ImgUsController } from './img-us.controller';

describe('ImgUsController', () => {
  let controller: ImgUsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImgUsController],
    }).compile();

    controller = module.get<ImgUsController>(ImgUsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
