/**
 * Example 13: Custom Fields
 *
 * Demonstrates:
 * - Getting custom fields for a list
 * - Setting custom field values on a task
 *
 * @see https://developer.clickup.com/reference/getcustomfields
 * @see https://developer.clickup.com/reference/setcustomfieldvalue
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

  console.log('\n🔍 Fetching custom fields...');
  const customFields = await client.getCustomFields(listId);

  if (customFields.length === 0) {
    console.log('⚠️  No custom fields found on this list');
    console.log('💡 Create custom fields in ClickUp UI first to test this feature');
    console.log('   (Settings → Lists → Custom Fields)');
    return;
  }

  console.log(`✅ Found ${customFields.length} custom field(s):`);
  customFields.forEach((field, index) => {
    console.log(`  ${index + 1}. ${field.name} (${field.id})`);
    console.log(`     - Type: ${field.type}`);
    console.log(`     - Required: ${field.required}`);
  });

  console.log('\n➕ Creating a task...');
  const task = await client.createTask(listId, {
    name: 'Task with Custom Fields (Example 13)',
  });

  console.log(`✅ Created task: ${task.id}`);

  const firstField = customFields[0];
  console.log(`\n✏️  Setting value for custom field "${firstField.name}"...`);

  let value: string | number | boolean;
  if (firstField.type === 'text' || firstField.type === 'url' || firstField.type === 'email') {
    value = 'Test Value';
  } else if (firstField.type === 'number' || firstField.type === 'currency') {
    value = 42;
  } else if (firstField.type === 'checkbox') {
    value = true;
  } else {
    value = 'Default';
  }

  await client.setCustomFieldValue(task.id, firstField.id, value);
  console.log(`✅ Set custom field value: ${value}`);

  console.log('\n🔍 Fetching task to verify...');
  const fetchedTask = await client.getTask(task.id);
  console.log(`✅ Task has ${fetchedTask.custom_fields?.length || 0} custom field value(s)`);

  console.log('\n✅ Custom field operations complete!');
  console.log('💡 Clean up tasks in ClickUp after experimenting.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
