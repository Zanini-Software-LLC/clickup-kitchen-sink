/**
 * Example 07: Subtasks
 *
 * Demonstrates:
 * - Creating a parent task
 * - Creating subtasks under a parent
 * - Fetching a task with its subtasks
 *
 * @see https://developer.clickup.com/reference/createtask
 * @see https://developer.clickup.com/reference/gettask
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

  console.log('\n➕ Creating parent task...');
  const parentTask = await client.createTask(listId, {
    name: 'Parent Task (Subtask Example)',
    description: 'This task will have subtasks',
  });

  console.log(`✅ Created parent: ${parentTask.name} (${parentTask.id})`);

  console.log('\n➕ Creating subtasks...');
  const subtask1 = await client.createTask(listId, {
    name: 'Subtask 1',
    parent: parentTask.id,
  });

  const subtask2 = await client.createTask(listId, {
    name: 'Subtask 2',
    parent: parentTask.id,
  });

  const subtask3 = await client.createTask(listId, {
    name: 'Subtask 3',
    parent: parentTask.id,
  });

  console.log(`✅ Created 3 subtasks: ${subtask1.id}, ${subtask2.id}, ${subtask3.id}`);

  console.log('\n🔍 Fetching parent with subtasks...');
  const taskWithSubtasks = await client.getTask(parentTask.id, { include_subtasks: true });

  console.log(`✅ Parent: ${taskWithSubtasks.name}`);
  console.log(`   - Subtasks count: ${taskWithSubtasks.subtasks?.length || 0}`);

  if (taskWithSubtasks.subtasks && taskWithSubtasks.subtasks.length > 0) {
    taskWithSubtasks.subtasks.forEach((subtask, index) => {
      console.log(`     ${index + 1}. ${subtask.name} (${subtask.id})`);
    });
  }

  console.log('\n✅ Subtask hierarchy created!');
  console.log('💡 Remember to clean up these tasks in ClickUp.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
