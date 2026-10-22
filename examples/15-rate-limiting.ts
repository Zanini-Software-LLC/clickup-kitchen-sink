/**
 * Example 15: Rate Limiting Handling
 *
 * Demonstrates:
 * - Automatic rate limit (429) retry with exponential backoff
 * - Built into HttpClient (FR-005)
 *
 * The ClickUp API returns 429 when rate limits are exceeded.
 * The client automatically retries with exponential backoff:
 * 1s → 2s → 4s → 8s → 16s (max 5 attempts)
 *
 * @see https://developer.clickup.com/reference/
 */

import { ClickUpClient } from '../src/client/index.js';

const apiToken = process.env.CLICKUP_API_TOKEN;
if (!apiToken) {
  console.error('❌ CLICKUP_API_TOKEN environment variable is required');
  process.exit(1);
}

const client = new ClickUpClient(apiToken);

async function main() {
  console.log('🔍 Testing rate limit handling...');
  console.log('💡 The client automatically retries on 429 responses');
  console.log('   with exponential backoff: 1s → 2s → 4s → 8s → 16s');

  console.log('\n🔍 Fetching user (should succeed)...');
  const user = await client.getUser();
  console.log(`✅ Success: ${user.username}`);

  console.log('\n🔍 Fetching workspaces (should succeed)...');
  const workspaces = await client.getWorkspaces();
  console.log(`✅ Success: ${workspaces.length} workspace(s)`);

  console.log('\n💡 Rate limiting info:');
  console.log('   - ClickUp API has per-token rate limits');
  console.log('   - Limits vary by plan (Free: 100/min, Unlimited: 100/min, Business+: higher)');
  console.log('   - The client logs retry attempts with DEBUG=clickup:*');
  console.log('   - After 5 failed retries, the client throws ClickUpAPIError with code 429');

  console.log('\n✅ Rate limiting demo complete!');
  console.log('💡 To see retry logs, run: DEBUG=clickup:* npm run example 15-rate-limiting');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    console.error('   Rate limit hit even after retries. Try again in a few minutes.');
  }
  process.exit(1);
});
