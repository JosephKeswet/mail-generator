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

export interface ISendMailOptions {
  from: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface IBulkEmailResponse {
  accepted: string[]; // List of successfully accepted email addresses
  rejected: string[]; // List of rejected email addresses
  ehlo: string[]; // List of EHLO server responses
  rejectedErrors: RejectedError[]; // Array of errors for rejected emails
  envelopeTime: number; // Time taken for the envelope phase (in ms)
  messageTime: number; // Time taken to send the message (in ms)
  messageSize: number; // Size of the message in bytes
  response: string; // Response message from the server
  envelope: Envelope; // Details of the envelope (from and to addresses)
  messageId: string; // Unique message ID
}

export interface RejectedError {
  code: string; // Error code
  response: string; // Error response message
  responseCode: number; // Response status code
  command: string; // SMTP command that caused the error
  recipient: string; // Email address of the rejected recipient
}

export interface Envelope {
  from: string; // Sender's email address
  to: string[]; // List of recipient email addresses
}
