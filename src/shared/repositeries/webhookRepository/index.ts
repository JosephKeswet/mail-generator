import { Injectable } from '@nestjs/common';
import { EventTypes } from 'src/shared/enums';
import { PrismaService } from 'src/shared/prisma';
import { IResponse } from 'src/shared/types';
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
  constructor(private prismaService: PrismaService) {}

  async save(payload): Promise<IResponse> {
    console.log(payload.events);

    // Check if the payload contains an array of events
    if (!Array.isArray(payload.events)) {
      const errorMsg = 'Payload is not an array';
      logger.error(errorMsg);
      return { message: errorMsg, status: 400 };
    }

    const errors: string[] = [];
    const savedEvents: any[] = [];

    // Iterate over the events
    for (const [index, event] of payload.events.entries()) {
      const {
        category,
        email,
        event: eventType,
        event_id,
        message_id,
        sending_stream,
        timestamp,
      } = event;

      // Check for missing required fields
      if (
        !category ||
        !email ||
        !eventType ||
        !event_id ||
        !message_id ||
        !sending_stream ||
        !timestamp
      ) {
        const errorMsg = `Missing required fields in event at index ${index}`;
        errors.push(errorMsg);
        logger.warn(errorMsg);
      }

      // Event-specific error messages (this is just for logging
      const errorMessageMap = {
        [EventTypes.bounce]: `Email delivery failed: Bounce detected for email ${email}`,
        [EventTypes.reject]: `Email rejected: ${event.reason || 'Reason not provided'}`,
        [EventTypes.unsubscribe]: `Email unsubscribed: ${event.reason || 'Reason not provided'}`,
      };

      if (eventType in errorMessageMap) {
        const errorMsg = errorMessageMap[eventType];
        errors.push(errorMsg);
        logger.error(`Event at index ${index}: ${errorMsg}`);
      }

      try {
        // Save the event to the database regardless of the event type
        const webhookEvent = await this.prismaService.webhookEvent.create({
          data: {
            category,
            email,
            event: eventType,
            eventId: event_id,
            messageId: message_id,
            sendingStream: sending_stream,
            timestamp,
          },
        });

        savedEvents.push(webhookEvent);
        logger.info(
          `Webhook event saved successfully for email ${email} at index ${index}`,
        );
      } catch (err) {
        // Log error if unable to save the event
        const errorMsg = `Error saving webhook event at index ${index}: ${err.message}`;
        errors.push(errorMsg);
        logger.error(errorMsg);
      }
    }

    // Determine the response status based on whether there were any errors
    const status = errors.length > 0 ? 500 : 200;
    const message =
      errors.length > 0
        ? 'There were errors processing some of the events'
        : 'All webhook events saved successfully';

    // Log the final status
    if (errors.length > 0) {
      logger.error(message);
    } else {
      logger.info(message);
    }

    // Return a response with the errors (if any) and the saved events
    return {
      message,
      status,
      data: {
        errors,
        savedEvents,
      },
    };
  }
}
