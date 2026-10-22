/**
 * Example 24: Pagination
 *
 * Demonstrates:
 * - Manual pagination with getTasks()
 * - Automatic pagination with paginateTasks() async generator
 * - Cursor-based pagination (FR-006)
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

  console.log('\n➕ Creating sample tasks for pagination...');
  for (let i = 1; i <= 10; i++) {
    await client.createTask(listId, { name: `Pagination Test Task ${i}` });
  }
  console.log('✅ Created 10 sample tasks');

  console.log('\n📋 Method 1: Manual pagination with getTasks()');
  let page = 0;
  let totalFetched = 0;
  let hasMore = true;

  while (hasMore && page < 3) {
    const result = await client.getTasks(listId, { page, include_closed: true });
    console.log(`   Page ${page}: ${result.tasks.length} task(s)`);

    result.tasks.forEach((task) => {
      console.log(`     - ${task.name}`);
    });

    totalFetched += result.tasks.length;
    hasMore = !!result.cursor;
    page++;

    if (result.tasks.length === 0) {
      hasMore = false;
    }
  }

  console.log(`   ✅ Total fetched (manual): ${totalFetched} task(s)`);

  console.log('\n📋 Method 2: Automatic pagination with paginateTasks()');
  let autoTotal = 0;
  let pageCount = 0;

  for await (const tasksPage of client.paginateTasks(listId, { include_closed: true })) {
    pageCount++;
    console.log(`   Page ${pageCount}: ${tasksPage.length} task(s)`);

    tasksPage.forEach((task) => {
      console.log(`     - ${task.name}`);
    });

    autoTotal += tasksPage.length;

    if (pageCount >= 3) {
      break;
    }
  }

  console.log(`   ✅ Total fetched (automatic): ${autoTotal} task(s)`);

  console.log('\n💡 Pagination Tips:');
  console.log('   - Use paginateTasks() for convenience (async generator)');
  console.log('   - Use getTasks() for fine-grained control');
  console.log('   - ClickUp uses cursor-based pagination internally');
  console.log('   - Page size varies based on API limits');
  console.log('   - Always check for cursor/last_page to continue');

  console.log('\n✅ Pagination demonstration complete!');
  console.log('💡 Clean up tasks in ClickUp after experimenting.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
