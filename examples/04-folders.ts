/**
 * Example 04: Folders
 *
 * Demonstrates:
 * - Listing folders in a space
 * - Creating a new folder
 *
 * @see https://developer.clickup.com/reference/getfolders
 * @see https://developer.clickup.com/reference/createfolder
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
    console.error('❌ No spaces found. Create a space first.');
    process.exit(1);
  }

  const spaceId = spaces[0].id;
  console.log(`✅ Using space: ${spaces[0].name} (${spaceId})`);

  console.log('\n📁 Fetching folders...');
  const folders = await client.getFolders(spaceId);
  console.log(`✅ Found ${folders.length} folder(s):`);

  folders.forEach((folder, index) => {
    console.log(`  ${index + 1}. ${folder.name} (${folder.id})`);
    console.log(`     - Hidden: ${folder.hidden}`);
    console.log(`     - Lists: ${folder.lists?.length || 0}`);
  });

  console.log('\n➕ Creating a new folder...');
  const newFolder = await client.createFolder(spaceId, {
    name: `Test Folder ${Date.now()}`,
  });

  console.log(`✅ Created folder: ${newFolder.name} (${newFolder.id})`);
  console.log('\n💡 Clean up test folders in ClickUp after experimenting.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
