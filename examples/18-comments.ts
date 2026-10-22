/**
 * Example 18: Comments
 *
 * Demonstrates:
 * - Creating comments on a task
 * - Fetching comments for a task
 *
 * @see https://developer.clickup.com/reference/createtaskcomment
 * @see https://developer.clickup.com/reference/gettaskcomments
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
    name: 'Task with Comments (Example 18)',
  });

  console.log(`✅ Created task: ${task.id}`);

  console.log('\n💬 Adding comments...');
  const comment1 = await client.createComment(task.id, {
    comment_text: 'This is the first comment',
  });

  const comment2 = await client.createComment(task.id, {
    comment_text: 'This is a second comment with more details',
  });

  console.log(`✅ Created comments: ${comment1.id}, ${comment2.id}`);

  console.log('\n🔍 Fetching all comments...');
  const comments = await client.getComments(task.id);
  console.log(`✅ Found ${comments.length} comment(s):`);

  comments.forEach((comment, index) => {
    console.log(`  ${index + 1}. ${comment.comment_text}`);
    console.log(`     - By: ${comment.user.username}`);
    console.log(`     - Date: ${new Date(parseInt(comment.date)).toISOString()}`);
    console.log(`     - Resolved: ${comment.resolved}`);
  });

  console.log('\n✅ Comment operations complete!');
  console.log('💡 Clean up tasks in ClickUp after experimenting.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
