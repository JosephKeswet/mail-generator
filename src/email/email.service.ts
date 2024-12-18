// email.service.ts

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from 'src/shared/dto/email';
import { IResponse } from 'src/shared/types';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}
  //   private transporter: nodemailer.Transporter;

  //   constructor() {
  //     this.transporter = nodemailer.createTransport({
  //       // service: 'Gmail',
  //       // auth: {
  //       //   user: 'jhezekiah19@gmail.com',
  //       //   pass: 'qcqqsdzdwzkyzjwr',
  //       // },
  //       auth: {
  //         user: '32239651f29803',
  //         pass: 'nleujfhoqiinaqmm',
  //       },

  //       host: 'sandbox.smtp.mailtrap.io',
  //     });
  //   }

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
      throw error; // Propagate the error
    }
  }
  //   async sendEmail({
  //     to,
  //     subject,
  //     message: text,
  //   }: SendEmailDto): Promise<IResponse> {
  //     const mailOptions = {
  //       from: 'jhezekiah19@gmail.com',
  //       to,
  //       subject,
  //       text,
  //     };

  //     try {
  //       await this.transporter.sendMail(mailOptions);
  //       return {
  //         message: 'Email sent successfully',
  //         status: 200,
  //       };
  //     } catch (error) {
  //       console.error('Error sending email:', error);
  //       throw error;
  //     }
  //   }
}
