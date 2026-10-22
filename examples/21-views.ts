/**
 * Example 21: Views
 *
 * Demonstrates:
 * - Getting views at workspace level
 * - Getting views at space level
 * - Getting views at list level
 *
 * @see https://developer.clickup.com/reference/getteamviews
 * @see https://developer.clickup.com/reference/getspaceviews
 * @see https://developer.clickup.com/reference/getlistviews
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
  console.log(`✅ Using workspace: ${workspaces[0].name} (${workspaceId})`);

  console.log('\n👁️  Fetching workspace views...');
  const workspaceViews = await client.getViews(workspaceId);
  console.log(`✅ Found ${workspaceViews.length} workspace view(s):`);

  workspaceViews.slice(0, 5).forEach((view, index) => {
    console.log(`  ${index + 1}. ${view.name}`);
    console.log(`     - Type: ${view.type}`);
    console.log(`     - Visibility: ${view.visibility}`);
  });

  console.log('\n📂 Fetching spaces...');
  const spaces = await client.getSpaces(workspaceId);

  if (spaces.length > 0) {
    const spaceId = spaces[0].id;
    console.log(`✅ Using space: ${spaces[0].name} (${spaceId})`);

    console.log('\n👁️  Fetching space views...');
    const spaceViews = await client.getSpaceViews(spaceId);
    console.log(`✅ Found ${spaceViews.length} space view(s):`);

    spaceViews.slice(0, 5).forEach((view, index) => {
      console.log(`  ${index + 1}. ${view.name}`);
      console.log(`     - Type: ${view.type}`);
    });

    console.log('\n📋 Fetching lists...');
    const folderlessLists = await client.getFolderlessLists(spaceId);

    if (folderlessLists.length > 0) {
      const listId = folderlessLists[0].id;
      console.log(`✅ Using list: ${folderlessLists[0].name} (${listId})`);

      console.log('\n👁️  Fetching list views...');
      const listViews = await client.getListViews(listId);
      console.log(`✅ Found ${listViews.length} list view(s):`);

      listViews.slice(0, 5).forEach((view, index) => {
        console.log(`  ${index + 1}. ${view.name}`);
        console.log(`     - Type: ${view.type}`);
      });
    } else {
      console.log('⚠️  No lists found in space');
    }
  } else {
    console.log('⚠️  No spaces found in workspace');
  }

  console.log('\n✅ View operations complete!');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
