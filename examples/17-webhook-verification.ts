/**
 * Example 17: Webhook Signature Verification
 *
 * Demonstrates:
 * - HMAC-SHA256 signature verification for incoming webhooks
 * - Timing-safe comparison to prevent timing attacks
 *
 * When ClickUp sends a webhook event, it includes an
 * X-Signature header with an HMAC-SHA256 hash. This example
 * shows how to verify that signature to ensure the webhook
 * came from ClickUp and wasn't tampered with.
 *
 * @see https://developer.clickup.com/reference/webhooks
 */

import { verifyWebhookSignature } from '../src/webhooks/signature-verification.js';

async function main() {
  console.log('🔐 Webhook Signature Verification Example\n');

  const webhookSecret = 'your_webhook_secret_from_clickup';
  const webhookPayload = JSON.stringify({
    event: 'taskCreated',
    task_id: '9hz',
    webhook_id: 'abc123',
  });

  const correctSignature = '3a7e8b6f4c9d2e1a0b3c5d7e9f1a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a';
  const incorrectSignature = 'invalid_signature_12345';

  console.log('📦 Payload:', webhookPayload);
  console.log('🔑 Secret:', webhookSecret.substring(0, 8) + '...\n');

  console.log('✅ Testing VALID signature...');
  const isValid = verifyWebhookSignature(webhookPayload, correctSignature, webhookSecret);
  console.log(`   Result: ${isValid ? 'VERIFIED ✓' : 'FAILED ✗'}`);

  console.log('\n❌ Testing INVALID signature...');
  const isInvalid = verifyWebhookSignature(webhookPayload, incorrectSignature, webhookSecret);
  console.log(`   Result: ${isInvalid ? 'VERIFIED ✓' : 'FAILED ✗'} (expected FAILED)`);

  console.log('\n💡 In a real webhook handler:');
  console.log('   1. Extract X-Signature header from request');
  console.log('   2. Read raw request body as string');
  console.log('   3. Call verifyWebhookSignature(body, signature, secret)');
  console.log('   4. Return 401 if verification fails');
  console.log('   5. Process webhook event if verification succeeds');

  console.log('\n📝 Example Express middleware:');
  console.log(`
    app.post('/webhooks/clickup', express.text(), (req, res) => {
      const signature = req.headers['x-signature'];
      const isValid = verifyWebhookSignature(
        req.body,
        signature,
        process.env.CLICKUP_WEBHOOK_SECRET
      );

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const event = JSON.parse(req.body);
      // Process event...
      res.json({ success: true });
    });
  `);

  console.log('\n✅ Signature verification example complete!');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
