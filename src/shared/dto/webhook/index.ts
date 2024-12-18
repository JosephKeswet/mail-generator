import {
  IsArray,
  IsString,
  IsOptional,
  IsObject,
  IsUUID,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO for custom variables
class CustomVariablesDto {
  @IsString()
  @IsOptional()
  variable_a?: string;

  @IsString()
  @IsOptional()
  variable_b?: string;

  @IsString()
  @IsOptional()
  foo?: string;

  @IsInt()
  @IsOptional()
  baz?: number;
}

// DTO for each event
export class EventDto {
  @IsString()
  event: string;

  @IsString()
  sending_stream: string;

  @IsString()
  category: string;

  @IsObject()
  @Type(() => CustomVariablesDto) // Automatically transforms the custom_variables object
  custom_variables: CustomVariablesDto;

  @IsUUID()
  message_id: string;

  @IsString()
  email: string;

  @IsUUID()
  event_id: string;
}

// DTO for the overall payload
export class WebhookPayloadDto {
  @IsArray()
  @Type(() => EventDto)
  events: EventDto[];
}
