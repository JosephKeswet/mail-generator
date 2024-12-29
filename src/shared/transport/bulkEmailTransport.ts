import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailtrapEmailTransport {
  public transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'bulk.smtp.mailtrap.io',
      port: 587,
      auth: {
        user: 'api',
        pass: '9fca7af39c77c9ce49830cd83d0a524d',
      },
    });
  }
}
