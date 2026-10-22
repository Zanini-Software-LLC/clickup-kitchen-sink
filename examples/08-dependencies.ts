/**
 * Example 08: Task Dependencies
 *
 * Demonstrates:
 * - Creating tasks
 * - Adding dependencies between tasks (task A blocks task B)
 * - Deleting dependencies
 *
 * @see https://developer.clickup.com/reference/adddependency
 * @see https://developer.clickup.com/reference/deletedependency
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

  console.log('\n➕ Creating tasks...');
  const taskA = await client.createTask(listId, {
    name: 'Task A (Blocking)',
  });

  const taskB = await client.createTask(listId, {
    name: 'Task B (Waiting)',
  });

  console.log(`✅ Created Task A: ${taskA.id}`);
  console.log(`✅ Created Task B: ${taskB.id}`);

  console.log('\n🔗 Adding dependency: Task B depends on Task A...');
  const dependency = await client.addDependency(taskB.id, taskA.id);

  console.log('✅ Dependency created:');
  console.log(`   - Task ID: ${dependency.task_id}`);
  console.log(`   - Depends On: ${dependency.depends_on}`);

  console.log('\n🔓 Removing dependency...');
  await client.deleteDependency(taskB.id, taskA.id);
  console.log('✅ Dependency removed');

  console.log('\n✅ Dependency workflow complete!');
  console.log('💡 Clean up tasks in ClickUp after experimenting.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
