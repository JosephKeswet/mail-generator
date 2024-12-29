import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { MailtrapEmailTransport } from 'src/shared/transport/bulkEmailTransport';
import { IBulkEmailResponse, IResponse } from 'src/shared/types';
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
export class BulkEmailRepository {
  constructor(private data: MailtrapEmailTransport) {}
  /**
   * Sends an email using the configured transporter
   * @param mailOptions Options for sending an email
   * @returns Promise<SentMessageInfo>
   */
  async sendEmail(mailOptions: {
    from: string;
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: Array<{
      filename: string;
      content: Buffer | string;
      contentType?: string;
    }>;
  }): Promise<IResponse> {
    try {
      const info: IBulkEmailResponse =
        await this.data.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully', info);
      if (info.rejected.length > 0) {
        for (const rejectedErrors of info.rejectedErrors) {
          logger.error(
            `Email rejected ${rejectedErrors.response}`,
            rejectedErrors,
          );
        }
      }
      return {
        status: 200,
        message: 'Emails sent successfully',
        data: info,
      };
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      logger.error('Error sending bulk emails', error);
      return {
        status: 500,
        message: 'Failed to send bulk emails',
        error: error.message,
      };
    }
  }
}
