/**
 * Example: List Workspaces
 *
 * Demonstrates: Listing all accessible workspaces (teams)
 *
 * API Reference: https://developer.clickup.com/reference/getauthorizedteams
 */

import { ClickUpClient, ClickUpAPIError } from '../src/client/index.js';

async function main() {
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    console.error('❌ CLICKUP_API_TOKEN environment variable is required');
    process.exit(1);
  }

  const client = new ClickUpClient(token);

  try {
    console.log('📋 Fetching workspaces...');
    const workspaces = await client.getWorkspaces();

    console.log('✅ Success!');
    console.log('');
    console.log(`Found ${workspaces.length} workspace(s):`);
    workspaces.forEach((workspace, index) => {
      console.log(`${index + 1}. ${workspace.name} (ID: ${workspace.id})`);
    });
    console.log('');
    console.log('Full Response:');
    console.log(JSON.stringify(workspaces, null, 2));
  } catch (error) {
    if (error instanceof ClickUpAPIError) {
      console.error(`❌ API Error (${error.statusCode}):`, error.message);
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
