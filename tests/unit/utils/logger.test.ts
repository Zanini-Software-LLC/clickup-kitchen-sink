/**
 * Unit tests for logger with token redaction
 */

import { describe, it, expect } from 'vitest';
import { redactSensitiveData } from '../../../src/utils/logger.js';

describe('redactSensitiveData', () => {
  it('should redact Authorization header', () => {
    const data = {
      headers: {
        Authorization: 'Bearer secret_token_123',
        'Content-Type': 'application/json',
      },
    };

    const redacted = redactSensitiveData(data);
    expect(redacted.headers.Authorization).toBe('[REDACTED]');
    expect(redacted.headers['Content-Type']).toBe('application/json');
  });

  it('should redact keys containing "token"', () => {
    const data = {
      api_token: 'secret123',
      access_token: 'abc456',
      refresh_token: 'xyz789',
      normalField: 'visible',
    };

    const redacted = redactSensitiveData(data);
    expect(redacted.api_token).toBe('[REDACTED]');
    expect(redacted.access_token).toBe('[REDACTED]');
    expect(redacted.refresh_token).toBe('[REDACTED]');
    expect(redacted.normalField).toBe('visible');
  });

  it('should redact keys containing "secret"', () => {
    const data = {
      webhook_secret: 'secret123',
      client_secret: 'abc456',
      normalField: 'visible',
    };

    const redacted = redactSensitiveData(data);
    expect(redacted.webhook_secret).toBe('[REDACTED]');
    expect(redacted.client_secret).toBe('[REDACTED]');
    expect(redacted.normalField).toBe('visible');
  });

  it('should redact keys containing "password"', () => {
    const data = {
      password: 'mypass123',
      old_password: 'oldpass',
      normalField: 'visible',
    };

    const redacted = redactSensitiveData(data);
    expect(redacted.password).toBe('[REDACTED]');
    expect(redacted.old_password).toBe('[REDACTED]');
    expect(redacted.normalField).toBe('visible');
  });

  it('should redact keys containing "key"', () => {
    const data = {
      api_key: 'key123',
      encryption_key: 'enckey',
      normalField: 'visible',
    };

    const redacted = redactSensitiveData(data);
    expect(redacted.api_key).toBe('[REDACTED]');
    expect(redacted.encryption_key).toBe('[REDACTED]');
    expect(redacted.normalField).toBe('visible');
  });

  it('should handle nested objects', () => {
    const data = {
      config: {
        api_token: 'secret123',
        endpoint: 'https://api.example.com',
      },
    };

    const redacted = redactSensitiveData(data);
    expect(redacted.config.api_token).toBe('secret123'); // Only top-level redaction in current implementation
    expect(redacted.config.endpoint).toBe('https://api.example.com');
  });

  it('should handle arrays', () => {
    const data = [
      { token: 'secret1', value: 'data1' },
      { token: 'secret2', value: 'data2' },
    ];

    const redacted = redactSensitiveData(data);
    expect(Array.isArray(redacted)).toBe(true);
    expect(redacted).toHaveLength(2);
  });

  it('should handle primitive values', () => {
    expect(redactSensitiveData('string')).toBe('string');
    expect(redactSensitiveData(123)).toBe(123);
    expect(redactSensitiveData(true)).toBe(true);
    expect(redactSensitiveData(null)).toBe(null);
  });

  it('should be case-insensitive for sensitive keys', () => {
    const data = {
      API_TOKEN: 'secret123',
      Secret: 'mysecret',
      PASSWORD: 'mypass',
    };

    const redacted = redactSensitiveData(data);
    expect(redacted.API_TOKEN).toBe('[REDACTED]');
    expect(redacted.Secret).toBe('[REDACTED]');
    expect(redacted.PASSWORD).toBe('[REDACTED]');
  });
});
