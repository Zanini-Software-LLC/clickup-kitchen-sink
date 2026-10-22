/**
 * Example 22: Workspace Members
 *
 * Demonstrates:
 * - Fetching members of a workspace
 *
 * @see https://developer.clickup.com/reference/getteammembers
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

  console.log('\n👥 Fetching workspace members...');
  const members = await client.getWorkspaceMembers(workspaceId);
  console.log(`✅ Found ${members.length} member(s):`);

  members.forEach((member, index) => {
    console.log(`  ${index + 1}. ${member.user.username}`);
    console.log(`     - ID: ${member.user.id}`);
    console.log(`     - Email: ${member.user.email || 'N/A'}`);
    console.log(`     - Role: ${member.user.role || 'N/A'}`);
    if (member.invited_by) {
      console.log(`     - Invited By: ${member.invited_by.username}`);
    }
  });

  console.log('\n✅ Member operations complete!');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
