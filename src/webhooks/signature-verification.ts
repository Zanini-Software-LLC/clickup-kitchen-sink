/**
 * Webhook signature verification using HMAC-SHA256
 *
 * @see https://developer.clickup.com/docs/webhooks-signature-verification
 * @example See examples/19-signature-verify.ts
 */

import crypto from 'crypto';

/**
 * Verify webhook signature using HMAC-SHA256
 *
 * @param payload Raw HTTP body as string
 * @param signature X-Signature header value
 * @param secret Webhook secret from creation response
 * @returns true if signature is valid, false otherwise
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  try {
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch (error) {
    // Invalid signature format or comparison error
    return false;
  }
}
