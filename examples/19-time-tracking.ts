/**
 * Example 19: Time Tracking
 *
 * Demonstrates:
 * - Creating time entries
 * - Fetching time entries for a workspace
 * - Filtering time entries by date, assignee, task
 *
 * @see https://developer.clickup.com/reference/createtimeentry
 * @see https://developer.clickup.com/reference/gettimeentries
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

  console.log('\n🔍 Fetching user...');
  const user = await client.getUser();
  console.log(`✅ Authenticated as: ${user.username} (${user.id})`);

  console.log('\n⏱️  Creating a time entry...');
  const now = Date.now();
  const oneHourAgo = now - 3600000;

  const timeEntry = await client.createTimeEntry(workspaceId, {
    description: 'Worked on API integration',
    start: oneHourAgo,
    duration: 3600000,
    assignee: user.id,
    billable: false,
  });

  console.log(`✅ Created time entry: ${timeEntry.id}`);
  console.log(`   - Description: ${timeEntry.description}`);
  console.log(`   - Duration: ${parseInt(timeEntry.duration) / 1000 / 60} minutes`);
  console.log(`   - Billable: ${timeEntry.billable}`);

  console.log('\n📊 Fetching time entries...');
  const timeEntries = await client.getTimeEntries(workspaceId, {
    assignee: user.id,
    start_date: oneHourAgo,
    end_date: now,
  });

  console.log(`✅ Found ${timeEntries.length} time entry/entries:`);

  timeEntries.forEach((entry, index) => {
    const durationMinutes = parseInt(entry.duration) / 1000 / 60;
    console.log(`  ${index + 1}. ${entry.description}`);
    console.log(`     - Duration: ${durationMinutes} minutes`);
    console.log(`     - User: ${entry.user.username}`);
    console.log(`     - Billable: ${entry.billable}`);
  });

  console.log('\n✅ Time tracking operations complete!');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
