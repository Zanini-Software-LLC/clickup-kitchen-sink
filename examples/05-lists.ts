/**
 * Example 05: Lists
 *
 * Demonstrates:
 * - Listing lists in a folder
 * - Getting folderless lists in a space
 * - Creating lists (both folder and folderless)
 *
 * @see https://developer.clickup.com/reference/getlists
 * @see https://developer.clickup.com/reference/getfolderlesslists
 * @see https://developer.clickup.com/reference/createlist
 * @see https://developer.clickup.com/reference/createfolderlesslist
 */

import { ClickUpClient } from '../src/client/index.js';

const apiToken = process.env.CLICKUP_API_TOKEN;
if (!apiToken) {
  console.error('❌ CLICKUP_API_TOKEN environment variable is required');
  process.exit(1);
}

const client = new ClickUpClient(apiToken);

async function main() {
  console.log('🔍 Fetching workspaces...');
  const workspaces = await client.getWorkspaces();

  if (workspaces.length === 0) {
    console.error('❌ No workspaces found.');
    process.exit(1);
  }

  const workspaceId = workspaces[0].id;
  console.log(`✅ Using workspace: ${workspaces[0].name}`);

  console.log('\n📂 Fetching spaces...');
  const spaces = await client.getSpaces(workspaceId);

  if (spaces.length === 0) {
    console.error('❌ No spaces found.');
    process.exit(1);
  }

  const spaceId = spaces[0].id;
  console.log(`✅ Using space: ${spaces[0].name} (${spaceId})`);

  console.log('\n📁 Fetching folders...');
  const folders = await client.getFolders(spaceId);

  if (folders.length > 0) {
    const folderId = folders[0].id;
    console.log(`✅ Using folder: ${folders[0].name} (${folderId})`);

    console.log('\n📋 Fetching lists in folder...');
    const lists = await client.getLists(folderId);
    console.log(`✅ Found ${lists.length} list(s):`);

    lists.forEach((list, index) => {
      console.log(`  ${index + 1}. ${list.name} (${list.id})`);
    });

    console.log('\n➕ Creating a new list in folder...');
    const newList = await client.createList(folderId, {
      name: `Test List ${Date.now()}`,
      content: 'Synthetic list for testing ClickUp API v2',
      priority: 3,
    });

    console.log(`✅ Created list: ${newList.name} (${newList.id})`);
  } else {
    console.log('⚠️  No folders found. Skipping folder lists.');
  }

  console.log('\n📋 Fetching folderless lists...');
  const folderlessLists = await client.getFolderlessLists(spaceId);
  console.log(`✅ Found ${folderlessLists.length} folderless list(s)`);

  console.log('\n➕ Creating a folderless list...');
  const newFolderlessList = await client.createFolderlessList(spaceId, {
    name: `Test Folderless List ${Date.now()}`,
    content: 'Synthetic folderless list',
  });

  console.log(`✅ Created folderless list: ${newFolderlessList.name} (${newFolderlessList.id})`);
  console.log('\n💡 Clean up test lists in ClickUp after experimenting.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
