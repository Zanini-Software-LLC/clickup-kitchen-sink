/**
 * Example 11: Assignees
 *
 * Demonstrates:
 * - Creating a task with assignees
 * - Adding assignees via update
 * - Removing assignees via update
 *
 * @see https://developer.clickup.com/reference/createtask
 * @see https://developer.clickup.com/reference/updatetask
 */

import { ClickUpClient } from '../src/client/index.js';

const apiToken = process.env.CLICKUP_API_TOKEN;
if (!apiToken) {
  console.error('❌ CLICKUP_API_TOKEN environment variable is required');
  process.exit(1);
}

const client = new ClickUpClient(apiToken);

async function main() {
  console.log('🔍 Fetching authenticated user...');
  const user = await client.getUser();
  console.log(`✅ Authenticated as: ${user.username} (ID: ${user.id})`);

  console.log('\n🔍 Finding a list...');
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

  console.log('\n➕ Creating a task with an assignee...');
  const task = await client.createTask(listId, {
    name: 'Task with Assignees (Example 11)',
    assignees: [user.id],
  });

  console.log(`✅ Created task: ${task.id}`);
  console.log(`   - Assignees: ${task.assignees.map((a) => a.username).join(', ')}`);

  console.log('\n✏️  Removing assignee via update...');
  const updatedTask = await client.updateTask(task.id, {
    assignees: {
      rem: [user.id],
    },
  });

  console.log(`✅ Assignees after removal: ${updatedTask.assignees.length}`);

  console.log('\n➕ Adding assignee back...');
  const reAssignedTask = await client.updateTask(task.id, {
    assignees: {
      add: [user.id],
    },
  });

  console.log(
    `✅ Assignees after re-add: ${reAssignedTask.assignees.map((a) => a.username).join(', ')}`,
  );

  console.log('\n✅ Assignee operations complete!');
  console.log('💡 Clean up tasks in ClickUp after experimenting.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
