/**
 * Example: Get Authenticated User
 *
 * Demonstrates: Authentication and retrieving user information
 *
 * Prerequisites:
 * - A ClickUp API token
 *
 * Usage:
 * ```bash
 * export CLICKUP_API_TOKEN="your_token_here"
 * npx ts-node examples/01-auth-user.ts
 * ```
 *
 * API Reference: https://developer.clickup.com/reference/getauthorizeduser
 *
 * @see ../src/client/index.ts for implementation details
 */

import { ClickUpClient, ClickUpAPIError } from '../src/client/index.js';

async function main() {
  // 1. Validate configuration
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    console.error('❌ Error: CLICKUP_API_TOKEN environment variable is required');
    console.error('');
    console.error('To get your API token:');
    console.error('1. Go to https://app.clickup.com/settings/apps');
    console.error('2. Click "Generate" under "API Token"');
    console.error('3. Set the token: export CLICKUP_API_TOKEN="your_token_here"');
    process.exit(1);
  }

  // 2. Initialize client
  const client = new ClickUpClient(token);

  try {
    // 3. Get user information
    console.log('📋 Fetching authenticated user information...');
    const user = await client.getUser();

    // 4. Display results
    console.log('✅ Success!');
    console.log('');
    console.log(`User: ${user.username} (${user.email})`);
    console.log(`ID: ${user.id}`);
    console.log(`Timezone: ${user.timezone}`);
    console.log('');
    console.log('Full Response:');
    console.log(JSON.stringify(user, null, 2));
  } catch (error) {
    // 5. Handle errors
    if (error instanceof ClickUpAPIError) {
      if (error.statusCode === 401) {
        console.error('❌ Authentication failed: Invalid API token');
        console.error('Please check your CLICKUP_API_TOKEN value');
      } else if (error.statusCode === 403) {
        console.error('❌ Permission denied: You do not have access to this resource');
      } else if (error.statusCode === 429) {
        console.error('❌ Rate limit exceeded: Too many requests');
        console.error(
          'The client should have automatically retried. This means all retries failed.',
        );
      } else {
        console.error(`❌ API Error (${error.statusCode}):`, error.message);
      }
    } else {
      console.error('❌ Unexpected error:', (error as Error).message);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
