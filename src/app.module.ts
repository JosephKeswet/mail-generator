import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { EmailController } from './email/email.controller';
import { WebhookHandlerService } from './webhook-handler/webhook-handler.service';
import { WebhookHandlerController } from './webhook-handler/webhook-handler.controller';
import { PrismaService } from './shared/prisma';
import { WebhookRepository } from './shared/repositeries/webhookRepository';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        // host: process.env.EMAIL_HOST,
        host: 'sandbox.smtp.mailtrap.io',
        auth: {
          user: process.env.EMAIL_USERNAME,
          // user: '32239651f29803',
          pass: process.env.EMAIL_PASSWORD,
          // pass: '02eb8005ae4541',
        },
      },
    }),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
  ],
  controllers: [AppController, EmailController, WebhookHandlerController],
  providers: [
    AppService,
    EmailService,
    WebhookHandlerService,
    PrismaService,
    WebhookRepository,
  ],
})
export class AppModule {}
