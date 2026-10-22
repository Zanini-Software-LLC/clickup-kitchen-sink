/**
 * Common types used across the ClickUp API v2 client
 */

export interface Status {
  id: string;
  status: string;
  type: 'open' | 'closed' | 'custom';
  orderindex: number;
  color: string;
}

export interface Priority {
  id: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  color: string;
  orderindex: string;
}

export class ClickUpAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode?: string,
    public response?: any,
  ) {
    super(message);
    this.name = 'ClickUpAPIError';
    Error.captureStackTrace(this, this.constructor);
  }
}
