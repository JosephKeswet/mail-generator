// email.service.ts

import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { BulkEmailDto, SendEmailDto } from 'src/shared/dto/email';
import { IResponse } from 'src/shared/types';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}

  async sendEmail({
    from,
    message: text,
    subject,
    to,
  }: SendEmailDto): Promise<IResponse> {
    try {
      // If `to` is an array, loop over each recipient and send the email one by one
      if (Array.isArray(to)) {
        for (const recipient of to) {
          const mailOptions = {
            from,
            to: recipient,
            subject,
            text,
          };
          await this.mailService.sendMail(mailOptions); // Send email to the current recipient
        }
      } else {
        // If `to` is a single email, send the email directly
        const mailOptions = {
          from,
          to,
          subject,
          text,
        };
        await this.mailService.sendMail(mailOptions);
      }

      return {
        message: 'Email sent successfully',
        status: 200,
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendBulkEmails(payload: ISendMailOptions): Promise<IResponse> {
    try {
      const mailOptions: ISendMailOptions = payload;
      await this.mailService.sendMail(mailOptions); // Send email to all recipients in the payload
      return {
        message: 'Bulk emails sent successfully',
        status: 200,
      };
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      throw error;
    }
  }
}
