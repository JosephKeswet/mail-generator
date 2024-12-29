import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { SendEmailDto } from 'src/shared/dto/email';
import { IResponse, ISendMailOptions } from 'src/shared/types';
import { EmailService } from './email.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { Express } from 'express';
import { FileSizeValidationPipe } from 'src/shared/pipes';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}
  @Post('send')
  @UseInterceptors(
    FilesInterceptor('attachments', 10, {
      // Limit to 10 files
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    }),
  )
  async sendEmail(
    @Body() sendEmailDto: SendEmailDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    // Build the attachments array from the uploaded files
    if (files && files.length > 0) {
      sendEmailDto.attachments = files.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype,
      }));
    }
    const response: IResponse = await this.emailService.sendEmail(sendEmailDto);
    return res.status(response.status).json(response);
  }
  @Post('send-bulk')
  @UseInterceptors(
    FilesInterceptor('attachments', 10, {
      // Limit to 10 files
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    }),
  )
  async sendBulEmails(
    @Body() bulkEmailDto: ISendMailOptions,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    // Build the attachments array from the uploaded files
    if (files && files.length > 0) {
      bulkEmailDto.attachments = files.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype,
      }));
    }

    const response: IResponse =
      await this.emailService.sendBulkEmails(bulkEmailDto);
    return res.status(response.status).json(response);
  }
}
