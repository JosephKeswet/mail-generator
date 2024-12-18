import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailerService) {}
  // getHello(): string {
  //   return 'Hello World!';
  // }

  async sendMail() {
    const message = `This is a test, please ignore this email!`;

    await this.mailService.sendMail({
      from: 'Joseph <kingsleyokgeorge@gmail.com>',
      to: 'josephkeswet@gmail.com',
      subject: `How to Send Emails with Nodemailer`,
      text: message,
    });
  }
}
