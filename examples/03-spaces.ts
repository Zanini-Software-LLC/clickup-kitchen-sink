/**
 * Example 03: Workspace Spaces
 *
 * Demonstrates:
 * - Listing spaces in a workspace
 * - Getting details for a specific space
 * - Creating a new space with features
 *
 * @see https://developer.clickup.com/reference/getspaces
 * @see https://developer.clickup.com/reference/getspace
 * @see https://developer.clickup.com/reference/createspace
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
    console.error('❌ No workspaces found. Please create one in ClickUp first.');
    process.exit(1);
  }

  const workspaceId = workspaces[0].id;
  console.log(`✅ Using workspace: ${workspaces[0].name} (${workspaceId})`);

  console.log('\n📂 Fetching spaces...');
  const spaces = await client.getSpaces(workspaceId);
  console.log(`✅ Found ${spaces.length} space(s):`);

  spaces.forEach((space, index) => {
    console.log(`  ${index + 1}. ${space.name} (${space.id})`);
    console.log(`     - Private: ${space.private}`);
    console.log(`     - Statuses: ${space.statuses.length}`);
  });

  if (spaces.length > 0) {
    console.log('\n🔍 Getting details for first space...');
    const spaceDetails = await client.getSpace(spaces[0].id);
    console.log(`✅ Space: ${spaceDetails.name}`);
    console.log(`   - Multiple Assignees: ${spaceDetails.multiple_assignees}`);
    console.log(`   - Features:`);
    console.log(`     • Due Dates: ${spaceDetails.features.due_dates.enabled}`);
    console.log(`     • Time Tracking: ${spaceDetails.features.time_tracking.enabled}`);
    console.log(`     • Tags: ${spaceDetails.features.tags.enabled}`);
    console.log(`     • Custom Fields: ${spaceDetails.features.custom_fields.enabled}`);
  }

  console.log('\n➕ Creating a new synthetic space...');
  const newSpace = await client.createSpace(workspaceId, {
    name: `Test Space ${Date.now()}`,
    multiple_assignees: true,
    features: {
      due_dates: {
        enabled: true,
        start_date: true,
        remap_due_dates: true,
        remap_closed_due_date: false,
      },
      time_tracking: { enabled: true },
      tags: { enabled: true },
      time_estimates: { enabled: true },
      checklists: { enabled: true },
      custom_fields: { enabled: true },
      remap_dependencies: { enabled: true },
      dependency_warning: { enabled: true },
      portfolios: { enabled: false },
    },
  });

  console.log(`✅ Created space: ${newSpace.name} (${newSpace.id})`);
  console.log('\n💡 Remember to delete test spaces manually in ClickUp to keep your workspace clean.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
