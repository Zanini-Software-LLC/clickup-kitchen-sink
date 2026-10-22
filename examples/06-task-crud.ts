/**
 * Example 06: Task CRUD Operations
 *
 * Demonstrates:
 * - Creating a task
 * - Reading/getting a task
 * - Updating a task
 * - Deleting a task
 *
 * @see https://developer.clickup.com/reference/createtask
 * @see https://developer.clickup.com/reference/gettask
 * @see https://developer.clickup.com/reference/updatetask
 * @see https://developer.clickup.com/reference/deletetask
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
  const folders = await client.getFolders(spaces[0].id);

  let listId: string;
  if (folders.length > 0) {
    const lists = await client.getLists(folders[0].id);
    if (lists.length === 0) {
      const newList = await client.createList(folders[0].id, { name: 'API Test List' });
      listId = newList.id;
    } else {
      listId = lists[0].id;
    }
  } else {
    const folderlessLists = await client.getFolderlessLists(spaces[0].id);
    if (folderlessLists.length === 0) {
      const newList = await client.createFolderlessList(spaces[0].id, { name: 'API Test List' });
      listId = newList.id;
    } else {
      listId = folderlessLists[0].id;
    }
  }

  console.log(`✅ Using list: ${listId}`);

  console.log('\n➕ Creating a task...');
  const task = await client.createTask(listId, {
    name: 'Test Task (CRUD Example)',
    description: 'Synthetic task created via ClickUp API v2',
    priority: 3,
    status: 'to do',
  });

  console.log(`✅ Created task: ${task.name} (${task.id})`);

  console.log('\n🔍 Reading the task back...');
  const fetchedTask = await client.getTask(task.id);
  console.log(`✅ Fetched: ${fetchedTask.name}`);
  console.log(`   - Status: ${fetchedTask.status.status}`);
  console.log(`   - Priority: ${fetchedTask.priority?.priority || 'None'}`);

  console.log('\n✏️  Updating the task...');
  const updatedTask = await client.updateTask(task.id, {
    name: 'Test Task (UPDATED)',
    description: 'Updated description',
    priority: 1,
  });

  console.log(`✅ Updated: ${updatedTask.name}`);
  console.log(`   - Priority: ${updatedTask.priority?.priority || 'None'}`);

  console.log('\n🗑️  Deleting the task...');
  await client.deleteTask(task.id);
  console.log('✅ Task deleted successfully');

  console.log('\n✅ CRUD cycle complete!');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
