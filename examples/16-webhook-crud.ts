/**
 * Example 16: Webhook CRUD Operations
 *
 * Demonstrates:
 * - Creating a webhook
 * - Listing webhooks
 * - Updating a webhook
 * - Deleting a webhook
 *
 * @see https://developer.clickup.com/reference/createwebhook
 * @see https://developer.clickup.com/reference/getwebhooks
 * @see https://developer.clickup.com/reference/updatewebhook
 * @see https://developer.clickup.com/reference/deletewebhook
 */

import { ClickUpClient } from '../src/client/index.js';

const apiToken = process.env.CLICKUP_API_TOKEN;
if (!apiToken) {
  console.error('❌ CLICKUP_API_TOKEN environment variable is required');
  process.exit(1);
}

const client = new ClickUpClient(apiToken);

async function main() {
  console.log('🔍 Fetching workspaces...');
  const workspaces = await client.getWorkspaces();

  if (workspaces.length === 0) {
    console.error('❌ No workspaces found.');
    process.exit(1);
  }

  const workspaceId = workspaces[0].id;
  console.log(`✅ Using workspace: ${workspaces[0].name} (${workspaceId})`);

  console.log('\n➕ Creating a webhook...');
  const webhook = await client.createWebhook(workspaceId, {
    endpoint: 'https://example.com/clickup-webhook',
    events: ['taskCreated', 'taskUpdated', 'taskDeleted'],
  });

  console.log(`✅ Created webhook: ${webhook.id}`);
  console.log(`   - Endpoint: ${webhook.endpoint}`);
  console.log(`   - Events: ${webhook.events.join(', ')}`);
  console.log(`   - Secret: ${webhook.secret.substring(0, 8)}...`);

  console.log('\n🔍 Listing all webhooks...');
  const webhooks = await client.getWebhooks(workspaceId);
  console.log(`✅ Found ${webhooks.length} webhook(s):`);

  webhooks.forEach((wh, index) => {
    console.log(`  ${index + 1}. ${wh.id}`);
    console.log(`     - Endpoint: ${wh.endpoint}`);
    console.log(`     - Events: ${wh.events.length}`);
    console.log(`     - Health: ${wh.health.status}`);
  });

  console.log('\n✏️  Updating webhook...');
  const updatedWebhook = await client.updateWebhook(webhook.id, {
    events: ['taskCreated', 'taskStatusUpdated'],
  });

  console.log(`✅ Updated webhook events: ${updatedWebhook.events.join(', ')}`);

  console.log('\n🗑️  Deleting webhook...');
  await client.deleteWebhook(webhook.id);
  console.log('✅ Webhook deleted successfully');

  console.log('\n✅ Webhook CRUD cycle complete!');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
