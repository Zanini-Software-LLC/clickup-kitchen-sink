/**
 * Example 09: Checklists
 *
 * Demonstrates:
 * - Creating a checklist on a task
 * - Adding checklist items
 *
 * @see https://developer.clickup.com/reference/createchecklist
 * @see https://developer.clickup.com/reference/createchecklistitem
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

  console.log('\n➕ Creating a task...');
  const task = await client.createTask(listId, {
    name: 'Task with Checklist (Example 09)',
  });

  console.log(`✅ Created task: ${task.id}`);

  console.log('\n📋 Creating a checklist...');
  const checklist = await client.createChecklist(task.id, {
    name: 'Setup Steps',
  });

  console.log(`✅ Created checklist: ${checklist.name} (${checklist.id})`);

  console.log('\n✅ Adding checklist items...');
  const item1 = await client.createChecklistItem(checklist.id, {
    name: 'Install dependencies',
  });

  const item2 = await client.createChecklistItem(checklist.id, {
    name: 'Configure environment',
  });

  const item3 = await client.createChecklistItem(checklist.id, {
    name: 'Run tests',
  });

  console.log(`✅ Created items: ${item1.name}, ${item2.name}, ${item3.name}`);

  console.log('\n✅ Checklist created!');
  console.log('💡 Clean up tasks in ClickUp after experimenting.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
