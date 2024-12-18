import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  message: string;

  @IsEmail()
  @IsNotEmpty()
  from: string;

  @IsEmail()
  @IsNotEmpty()
  to: string | string[];
}
