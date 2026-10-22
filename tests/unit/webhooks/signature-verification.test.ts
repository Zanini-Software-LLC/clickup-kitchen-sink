/**
 * Unit tests for webhook signature verification
 */

import { describe, it, expect } from 'vitest';
import { verifyWebhookSignature } from '../../../src/webhooks/signature-verification.js';
import crypto from 'crypto';

describe('verifyWebhookSignature', () => {
  const secret = 'test_webhook_secret_12345';
  const payload = JSON.stringify({ event: 'taskCreated', task_id: '123' });

  it('should return true for valid signature', () => {
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const result = verifyWebhookSignature(payload, signature, secret);
    expect(result).toBe(true);
  });

  it('should return false for invalid signature', () => {
    const invalidSignature = 'invalid_signature_abcdef12345';

    const result = verifyWebhookSignature(payload, invalidSignature, secret);
    expect(result).toBe(false);
  });

  it('should return false for signature with wrong secret', () => {
    const wrongSecret = 'wrong_secret';
    const signature = crypto.createHmac('sha256', wrongSecret).update(payload).digest('hex');

    const result = verifyWebhookSignature(payload, signature, secret);
    expect(result).toBe(false);
  });

  it('should return false for tampered payload', () => {
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const tamperedPayload = payload + 'tampered';

    const result = verifyWebhookSignature(tamperedPayload, signature, secret);
    expect(result).toBe(false);
  });

  it('should handle empty payload', () => {
    const emptyPayload = '';
    const signature = crypto.createHmac('sha256', secret).update(emptyPayload).digest('hex');

    const result = verifyWebhookSignature(emptyPayload, signature, secret);
    expect(result).toBe(true);
  });

  it('should handle large payloads', () => {
    const largePayload = JSON.stringify({
      event: 'taskUpdated',
      data: 'x'.repeat(10000),
    });
    const signature = crypto.createHmac('sha256', secret).update(largePayload).digest('hex');

    const result = verifyWebhookSignature(largePayload, signature, secret);
    expect(result).toBe(true);
  });
});
