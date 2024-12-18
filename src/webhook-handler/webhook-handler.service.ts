import { Injectable } from '@nestjs/common';
import { WebhookRepository } from 'src/shared/repositeries/webhookRepository';
import { MailtrapWebhookPayload, WebhookHandler } from 'src/shared/types';

@Injectable()
export class WebhookHandlerService implements WebhookHandler {
  constructor(
    private webhookRepository: WebhookRepository,
    // private emailService: EmailService,
  ) {}
  async handleWebhook(payload: MailtrapWebhookPayload): Promise<void> {
    // Save the webhook payload to a database
    await this.webhookRepository.save(payload);
  }
}
