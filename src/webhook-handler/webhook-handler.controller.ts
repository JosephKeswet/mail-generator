import { Controller, Post, Body } from '@nestjs/common';
import { WebhookHandlerService } from './webhook-handler.service';
import { MailtrapWebhookPayload } from 'src/shared/types';

@Controller('webhook-handler')
export class WebhookHandlerController {
  constructor(private readonly webhookHandler: WebhookHandlerService) {}

  @Post()
  async handleWebhook(
    @Body() payload: MailtrapWebhookPayload,
  ): Promise<string> {
    try {
      await this.webhookHandler.handleWebhook(payload);
    } catch (err) {
      console.error('Webhook handler error:', err.message);
      return 'Webhook Handler Error';
    }
  }
}
