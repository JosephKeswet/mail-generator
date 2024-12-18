import { Test, TestingModule } from '@nestjs/testing';
import { WebhookHandlerService } from './webhook-handler.service';

describe('WebhookHandlerService', () => {
  let service: WebhookHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookHandlerService],
    }).compile();

    service = module.get<WebhookHandlerService>(WebhookHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
