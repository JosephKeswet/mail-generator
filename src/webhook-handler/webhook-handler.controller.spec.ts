import { Test, TestingModule } from '@nestjs/testing';
import { WebhookHandlerController } from './webhook-handler.controller';

describe('WebhookHandlerController', () => {
  let controller: WebhookHandlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookHandlerController],
    }).compile();

    controller = module.get<WebhookHandlerController>(WebhookHandlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
