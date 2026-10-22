/**
 * Debug logging with automatic API token redaction
 * Usage: DEBUG=clickup:* node script.js
 */

import debug from 'debug';

const SENSITIVE_KEYS = ['token', 'secret', 'password', 'key', 'authorization'];

/**
 * Redacts sensitive data from objects and strings
 */
export function redactSensitiveData(data: any): any {
  if (typeof data === 'string') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(redactSensitiveData);
  }

  if (data && typeof data === 'object') {
    const redacted: any = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = SENSITIVE_KEYS.some((sensitiveKey) =>
        lowerKey.includes(sensitiveKey),
      );

      if (isSensitive) {
        redacted[key] = '[REDACTED]';
      } else if (key === 'headers' && typeof value === 'object' && value !== null) {
        // Special handling for headers object
        redacted[key] = redactSensitiveData(value);
      } else {
        redacted[key] = value;
      }
    }
    return redacted;
  }

  return data;
}

// Create debug namespaces
export const httpLogger = debug('clickup:http');
export const retryLogger = debug('clickup:retry');
export const paginationLogger = debug('clickup:pagination');

// Wrapper that auto-redacts
export function logHttp(message: string, data?: any) {
  if (httpLogger.enabled) {
    httpLogger(message, data ? redactSensitiveData(data) : '');
  }
}

export function logRetry(message: string, data?: any) {
  if (retryLogger.enabled) {
    retryLogger(message, data ? redactSensitiveData(data) : '');
  }
}

export function logPagination(message: string, data?: any) {
  if (paginationLogger.enabled) {
    paginationLogger(message, data ? redactSensitiveData(data) : '');
  }
}
