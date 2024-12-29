// email.service.ts

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { BulkEmailDto, SendEmailDto } from 'src/shared/dto/email';
import { BulkEmailRepository } from 'src/shared/repositeries/bulkEmailRepository';
import { MailtrapEmailTransport } from 'src/shared/transport/bulkEmailTransport';
import { IResponse, ISendMailOptions } from 'src/shared/types';

@Injectable()
export class EmailService {
  constructor(
    private mailService: MailerService,
    private bulkEmailRepository: BulkEmailRepository,
  ) {}

  async sendEmail({
    from,
    message: text,
    subject,
    to,
    attachments,
    cc,
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
            attachments,
            cc,
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
          attachments,
          cc,
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

  async sendBulkEmails(bulkEmailDto: ISendMailOptions): Promise<IResponse> {
    // const { from, to, cc, bcc, subject, text, html, attachments } =
    //   bulkEmailDto;

    return await this.bulkEmailRepository.sendEmail(bulkEmailDto);
  }

  async metrics() {}
}
