import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma';
import { IResponse, MailtrapWebhookPayload } from 'src/shared/types';

@Injectable()
export class WebhookRepository {
  constructor(private data: PrismaService) {}

  async save(payload): Promise<IResponse> {
    // Check if payload is an array
    if (!Array.isArray(payload.events)) {
      return {
        message: 'Payload is not an array',
        status: 400,
      };
    }

    // Iterate over each event in the payload array
    for (let i = 0; i < payload.events.length; i++) {
      const {
        category,
        email,
        event,
        event_id,
        message_id,
        sending_stream,
        timestamp,
      } = payload.events[i]; // Access individual event

      // Validate if all required fields are present
      if (
        !category ||
        !email ||
        !event ||
        !event_id ||
        !message_id ||
        !sending_stream ||
        !timestamp
      ) {
        return {
          message: 'Missing required fields in the webhook payload',
          status: 400,
        };
      }

      try {
        // Save the webhook event to the database
        const webhookEvent = await this.data.webhookEvent.create({
          data: {
            category,
            email,
            event,
            eventId: event_id,
            messageId: message_id,
            sendingStream: sending_stream,
            timestamp,
          },
        });

        return {
          message: 'Webhook event saved successfully',
          status: 200,
          data: webhookEvent,
        };
      } catch (err) {
        console.error('Error saving webhook event:', err);
        return {
          message: `Error saving webhook event at index ${i}`,
          status: 500,
        };
      }
    }
  }
}
