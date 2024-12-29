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
    if (!Array.isArray(payload.events)) {
      const errorMsg = 'Payload is not an array';
      logger.error(errorMsg);
      return { message: errorMsg, status: 400 };
    }

    const errors: string[] = [];
    const savedEvents: any[] = [];

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
        continue;
      }

      const errorMessageMap = {
        [EventTypes.bounce]: `Email delivery failed: Bounce detected for email ${email}`,
        [EventTypes.reject]: `Email rejected: ${event.reason || 'Reason not provided'}`,
        [EventTypes.unsubscribe]: `Email unsubscribed: ${event.reason || 'Reason not provided'}`,
      };

      if (eventType in errorMessageMap) {
        const errorMsg = errorMessageMap[eventType];

        errors.push(errorMsg);
        logger.error(`Event at index ${index}: ${errorMsg}`);
        continue;
      }

      try {
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
        const errorMsg = `Error saving webhook event at index ${index}: ${err.message}`;

        errors.push(errorMsg);
        logger.error(errorMsg);
      }
    }

    const status = errors.length > 0 ? 500 : 200;
    const message =
      errors.length > 0
        ? 'There were errors processing some of the events'
        : 'All webhook events saved successfully';

    if (errors.length > 0) {
      logger.error(message);
    } else {
      logger.info(message);
    }

    return {
      message,
      status,
      data: errors.length > 0 ? { errors, savedEvents } : savedEvents,
    };
  }
}
