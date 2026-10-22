/**
 * Example 12: Attachments
 *
 * Note: The ClickUp API does not currently provide a public endpoint
 * for uploading file attachments directly via HTTP. Attachments are
 * typically uploaded through the web UI or integrations.
 *
 * This example demonstrates how you would structure attachment
 * metadata if the endpoint becomes available in the future.
 *
 * For now, attachments can be viewed on tasks via the task response.
 *
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

  console.log('\n➕ Creating a task...');
  const task = await client.createTask(listId, {
    name: 'Task with Attachments (Example 12)',
    description: 'This task demonstrates attachment metadata',
  });

  console.log(`✅ Created task: ${task.id}`);

  console.log('\n📎 Fetching task attachments...');
  const fetchedTask = await client.getTask(task.id);

  if (fetchedTask.attachments && fetchedTask.attachments.length > 0) {
    console.log(`✅ Found ${fetchedTask.attachments.length} attachment(s):`);
    fetchedTask.attachments.forEach((attachment, index) => {
      console.log(`  ${index + 1}. ${attachment.title || attachment.url}`);
      console.log(`     - URL: ${attachment.url}`);
    });
  } else {
    console.log('⚠️  No attachments found on this task');
    console.log('💡 Add attachments manually in the ClickUp UI to test this feature');
  }

  console.log('\n✅ Attachment check complete!');
  console.log('💡 Clean up tasks in ClickUp after experimenting.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
