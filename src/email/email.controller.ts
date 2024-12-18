import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { SendEmailDto } from 'src/shared/dto/email';
import { IResponse } from 'src/shared/types';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}
  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto, @Res() res: Response) {
    const response: IResponse = await this.emailService.sendEmail(sendEmailDto);
    return res.status(response.status).json(response);
  }
}
