/**
 * Example 23: Error Handling
 *
 * Demonstrates:
 * - Handling ClickUpAPIError for different HTTP status codes
 * - 401 Unauthorized (invalid token)
 * - 404 Not Found (resource doesn't exist)
 * - 429 Rate Limit (exceeded rate limits)
 * - Network errors and timeouts
 *
 * @see https://developer.clickup.com/reference/
 */

import { ClickUpClient, ClickUpAPIError } from '../src/client/index.js';

const apiToken = process.env.CLICKUP_API_TOKEN;
if (!apiToken) {
  console.error('❌ CLICKUP_API_TOKEN environment variable is required');
  process.exit(1);
}

const client = new ClickUpClient(apiToken);

async function main() {
  console.log('🔍 Testing error handling...\n');

  console.log('✅ Test 1: Valid API call (should succeed)');
  try {
    const user = await client.getUser();
    console.log(`   Success: ${user.username}`);
  } catch (error) {
    console.error('   Unexpected error:', error);
  }

  console.log('\n❌ Test 2: 404 Not Found (non-existent task)');
  try {
    await client.getTask('nonexistent_task_id_12345');
    console.log('   Unexpected success');
  } catch (error) {
    if (error instanceof ClickUpAPIError) {
      console.log(`   ✓ Caught ClickUpAPIError: ${error.code}`);
      console.log(`   ✓ Status: ${error.statusCode}`);
      console.log(`   ✓ Message: ${error.message}`);
    } else {
      console.error('   Unexpected error type:', error);
    }
  }

  console.log('\n❌ Test 3: Invalid token (should get 401)');
  const invalidClient = new ClickUpClient('invalid_token_12345');
  try {
    await invalidClient.getUser();
    console.log('   Unexpected success');
  } catch (error) {
    if (error instanceof ClickUpAPIError) {
      console.log(`   ✓ Caught ClickUpAPIError: ${error.code}`);
      console.log(`   ✓ Status: ${error.statusCode}`);
      console.log(`   ✓ Message: ${error.message}`);
    } else {
      console.error('   Unexpected error type:', error);
    }
  }

  console.log('\n💡 Error Handling Best Practices:');
  console.log('   - Always catch ClickUpAPIError for API calls');
  console.log('   - Check error.code for specific error types');
  console.log('   - Use error.statusCode for HTTP status codes');
  console.log('   - Log error.message for debugging');
  console.log('   - Implement exponential backoff for 429 (built-in)');
  console.log('   - Set timeout option to avoid hanging requests');

  console.log('\n📝 Example error handling pattern:');
  console.log(`
    try {
      const task = await client.getTask(taskId);
      // Process task...
    } catch (error) {
      if (error instanceof ClickUpAPIError) {
        switch (error.statusCode) {
          case 401:
            // Invalid token
            break;
          case 404:
            // Task not found
            break;
          case 429:
            // Rate limit (already retried)
            break;
          default:
            // Other API error
            break;
        }
      } else {
        // Network or other error
      }
    }
  `);

  console.log('\n✅ Error handling demonstration complete!');
}

main().catch((error) => {
  console.error('❌ Unhandled error:', error.message);
  process.exit(1);
});
