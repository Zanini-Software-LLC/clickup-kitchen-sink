/**
 * Example 10: Tags
 *
 * Demonstrates:
 * - Adding tags to a task
 * - Removing tags from a task
 *
 * @see https://developer.clickup.com/reference/addtagtotask
 * @see https://developer.clickup.com/reference/removetagfromtask
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
    name: 'Task with Tags (Example 10)',
  });

  console.log(`✅ Created task: ${task.id}`);

  console.log('\n🏷️  Adding tags...');
  await client.addTag(task.id, 'urgent');
  console.log('✅ Added tag: urgent');

  await client.addTag(task.id, 'backend');
  console.log('✅ Added tag: backend');

  await client.addTag(task.id, 'api');
  console.log('✅ Added tag: api');

  console.log('\n🔍 Fetching task to verify tags...');
  const fetchedTask = await client.getTask(task.id);
  console.log(`✅ Task tags: ${fetchedTask.tags.map((t) => t.name).join(', ')}`);

  console.log('\n🗑️  Removing a tag...');
  await client.removeTag(task.id, 'urgent');
  console.log('✅ Removed tag: urgent');

  const updatedTask = await client.getTask(task.id);
  console.log(`✅ Remaining tags: ${updatedTask.tags.map((t) => t.name).join(', ')}`);

  console.log('\n✅ Tag operations complete!');
  console.log('💡 Clean up tasks in ClickUp after experimenting.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
