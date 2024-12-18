import { HttpStatus } from '@nestjs/common';

export type ISuccessResponse = {
  message: string;
  token?: string;
  data: Record<string, any> | string | number;
  status?: HttpStatus;
};

export type IErrorResponse = {
  status?: HttpStatus;
  message: string;
  error?: null;
};
export type IResponse = ISuccessResponse | IErrorResponse;

export interface MailtrapWebhookPayload {
  event: string; // The type of event (e.g., 'delivery')
  category: string; // Category of the email (e.g., 'Password reset', 'Email confirmation')
  custom_variables: Record<string, any>; // Custom variables attached to the email
  message_id: string; // Unique identifier for the message
  email: string; // Recipient's email address
  event_id: string; // Unique identifier for the event
  timestamp: number; // Timestamp of the event
  sending_stream: string; // Type of sending stream (e.g., 'transactional')
}

export interface WebhookHandler {
  handleWebhook(payload: MailtrapWebhookPayload): Promise<void>;
}
