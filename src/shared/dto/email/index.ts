import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBase64,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class Attachment {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  content: Buffer | string;

  @IsOptional()
  @IsString()
  contentType?: string;
}

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

  @IsEmail()
  @IsNotEmpty()
  cc: string | string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Validate each item in the array
  @Type(() => Attachment) // Ensure that the array elements are treated as Attachment objects
  attachments?: Attachment[];
}

// Address DTO with required address field
class Address {
  @IsEmail()
  @IsString()
  address: string; // Renamed to 'address' to match ISendMailOptions interface

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}

// Attachment DTO
// class Attachment {
//   @IsBase64()
//   @IsString()
//   content: string;

//   @IsString()
//   type: string;

//   @IsString()
//   filename: string;

//   @IsOptional()
//   @IsIn(['inline', 'attachment'])
//   disposition: 'inline' | 'attachment' = 'attachment';

//   @IsOptional()
//   @IsString()
//   content_id?: string;

//   @IsOptional()
//   @IsObject()
//   headers?: Record<string, string>;

//   @IsOptional()
//   @IsObject()
//   custom_variables?: Record<string, string>;
// }

// BulkEmail DTO
export class BulkEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayMaxSize(1000)
  @ValidateNested({ each: true })
  @Type(() => Address)
  to: Address[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(1000)
  @ValidateNested({ each: true })
  @Type(() => Address)
  cc?: Address[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(1000)
  @ValidateNested({ each: true })
  @Type(() => Address)
  bcc?: Address[];

  @ValidateNested()
  @Type(() => Address)
  reply_to: Address;

  @IsArray()
  @ArrayMaxSize(10) // Example: max of 10 attachments
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  attachments: Attachment[];

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  html: string;

  @IsOptional()
  @IsString()
  category?: string;
}
