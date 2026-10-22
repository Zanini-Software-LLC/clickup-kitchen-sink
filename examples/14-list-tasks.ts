/**
 * Example 14: List Tasks
 *
 * Demonstrates:
 * - Getting tasks from a list
 * - Filtering tasks by status, assignee, tags, dates
 *
 * @see https://developer.clickup.com/reference/gettasks
 */

import { ClickUpClient } from '../src/client/index.js';

const apiToken = process.env.CLICKUP_API_TOKEN;
if (!apiToken) {
  console.error('❌ CLICKUP_API_TOKEN environment variable is required');
  process.exit(1);
}

const client = new ClickUpClient(apiToken);

async function main() {
  console.log('🔍 Finding a list...');
  const workspaces = await client.getWorkspaces();
  const spaces = await client.getSpaces(workspaces[0].id);
  const folderlessLists = await client.getFolderlessLists(spaces[0].id);

  let listId: string;
  if (folderlessLists.length === 0) {
    const newList = await client.createFolderlessList(spaces[0].id, { name: 'API Test List' });
    listId = newList.id;
  } else {
    listId = folderlessLists[0].id;
  }

  console.log(`✅ Using list: ${listId}`);

  console.log('\n➕ Creating sample tasks...');
  await client.createTask(listId, { name: 'Sample Task 1', status: 'to do' });
  await client.createTask(listId, { name: 'Sample Task 2', status: 'in progress' });
  await client.createTask(listId, { name: 'Sample Task 3', status: 'to do' });
  console.log('✅ Created 3 sample tasks');

  console.log('\n📋 Fetching all tasks...');
  const result = await client.getTasks(listId, { include_closed: true });
  console.log(`✅ Found ${result.tasks.length} task(s):`);

  result.tasks.forEach((task, index) => {
    console.log(`  ${index + 1}. ${task.name}`);
    console.log(`     - Status: ${task.status.status}`);
    console.log(`     - ID: ${task.id}`);
  });

  console.log('\n🔍 Filtering tasks by status "to do"...');
  const todoResult = await client.getTasks(listId, {
    statuses: ['to do'],
    include_closed: false,
  });

  console.log(`✅ Found ${todoResult.tasks.length} "to do" task(s):`);
  todoResult.tasks.forEach((task, index) => {
    console.log(`  ${index + 1}. ${task.name}`);
  });

  console.log('\n✅ Task listing complete!');
  console.log('💡 Clean up tasks in ClickUp after experimenting.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
