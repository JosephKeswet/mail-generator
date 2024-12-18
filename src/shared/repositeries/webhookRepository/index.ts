import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma';
import { IResponse, MailtrapWebhookPayload } from 'src/shared/types';
import { formatDate } from 'src/shared/utils';
import * as winston from 'winston';

// Setup Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${formatDate(timestamp)} ${level}: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error',
    }),
  ],
});

@Injectable()
export class WebhookRepository {
  constructor(private data: PrismaService) {}

  async save(payload): Promise<IResponse> {
    // Check if payload is an array
    if (!Array.isArray(payload.events)) {
      logger.error('Payload is not an array');
      return {
        message: 'Payload is not an array',
        status: 400,
      };
    }

    const errors: string[] = [];
    const savedEvents: any[] = [];

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
        const errorMsg = `Missing required fields in event at index ${i}`;
        errors.push(errorMsg);
        logger.warn(errorMsg);
        continue; // Skip this event and move to the next one
      }

      // Handle email delivery failure (bounce event)
      if (event === 'bounce') {
        const errorMsg = `Email delivery failed for event at index ${i}: Bounce detected for email ${email}`;
        errors.push(errorMsg);
        logger.error(errorMsg);
        continue; // Skip this event and move to the next one
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

        savedEvents.push(webhookEvent);
        logger.info(
          `Webhook event saved successfully for email ${email} at index ${i}`,
        );
      } catch (err) {
        const errorMsg = `Error saving webhook event at index ${i}: ${err.message}`;
        errors.push(errorMsg);
        logger.error(errorMsg); // Log the error
      }
    }

    // Return response based on success or failure
    if (errors.length > 0) {
      logger.error('There were errors processing some of the events');
      return {
        message: 'There were errors processing some of the events',
        status: 500,
        data: {
          errors,
          savedEvents,
        },
      };
    }

    logger.info('All webhook events saved successfully');
    return {
      message: 'All webhook events saved successfully',
      status: 200,
      data: savedEvents,
    };
  }
}
