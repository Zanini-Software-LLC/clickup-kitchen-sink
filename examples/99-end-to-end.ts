/**
 * Example 99: End-to-End Workflow
 *
 * Comprehensive demonstration of a complete ClickUp workflow:
 * 1. Create a space
 * 2. Create a folder in the space
 * 3. Create a list in the folder
 * 4. Create a task with custom field values
 * 5. Register a webhook to track task events
 * 6. Update the task (triggers webhook)
 * 7. Add comments and time entries
 * 8. Clean up webhook
 *
 * This example showcases the full ClickUp API v2 workflow
 * for task management with webhooks and tracking.
 *
 * @see https://developer.clickup.com/reference/
 */

import { ClickUpClient } from '../src/client/index.js';

const apiToken = process.env.CLICKUP_API_TOKEN;
if (!apiToken) {
  console.error('❌ CLICKUP_API_TOKEN environment variable is required');
  process.exit(1);
}

const client = new ClickUpClient(apiToken);

async function main() {
  console.log('🚀 ClickUp API v2 End-to-End Workflow\n');
  console.log('='.repeat(60));

  console.log('\n📊 Step 1: Get workspace information');
  const workspaces = await client.getWorkspaces();
  if (workspaces.length === 0) {
    console.error('❌ No workspaces found.');
    process.exit(1);
  }

  const workspace = workspaces[0];
  console.log(`✅ Using workspace: ${workspace.name} (${workspace.id})`);

  console.log('\n📂 Step 2: Create a space');
  const space = await client.createSpace(workspace.id, {
    name: `E2E Test Space ${Date.now()}`,
    multiple_assignees: true,
    features: {
      due_dates: {
        enabled: true,
        start_date: true,
        remap_due_dates: true,
        remap_closed_due_date: false,
      },
      time_tracking: { enabled: true },
      tags: { enabled: true },
      custom_fields: { enabled: true },
      checklists: { enabled: true },
      time_estimates: { enabled: true },
      remap_dependencies: { enabled: true },
      dependency_warning: { enabled: true },
      portfolios: { enabled: false },
    },
  });

  console.log(`✅ Created space: ${space.name} (${space.id})`);

  console.log('\n📁 Step 3: Create a folder');
  const folder = await client.createFolder(space.id, {
    name: 'E2E Test Folder',
  });

  console.log(`✅ Created folder: ${folder.name} (${folder.id})`);

  console.log('\n📋 Step 4: Create a list');
  const list = await client.createList(folder.id, {
    name: 'E2E Test List',
    content: 'This list is part of an end-to-end workflow test',
    priority: 2,
  });

  console.log(`✅ Created list: ${list.name} (${list.id})`);

  console.log('\n📝 Step 5: Fetch custom fields (if any)');
  const customFields = await client.getCustomFields(list.id);
  console.log(`✅ Found ${customFields.length} custom field(s)`);

  console.log('\n✨ Step 6: Create a task with optional custom field');
  const taskData: any = {
    name: 'E2E Test Task with Full Workflow',
    description: 'This task demonstrates the complete ClickUp API v2 workflow',
    priority: 1,
    status: 'to do',
    tags: ['e2e-test', 'api-demo'],
  };

  if (customFields.length > 0) {
    const firstField = customFields[0];
    console.log(`   Setting custom field: ${firstField.name}`);

    let fieldValue: any;
    if (firstField.type === 'text' || firstField.type === 'url' || firstField.type === 'email') {
      fieldValue = 'E2E Test Value';
    } else if (firstField.type === 'number' || firstField.type === 'currency') {
      fieldValue = 100;
    } else if (firstField.type === 'checkbox') {
      fieldValue = true;
    } else {
      fieldValue = 'Test';
    }

    taskData.custom_fields = [{ id: firstField.id, value: fieldValue }];
  }

  const task = await client.createTask(list.id, taskData);
  console.log(`✅ Created task: ${task.name} (${task.id})`);

  console.log('\n🔔 Step 7: Register a webhook');
  const webhook = await client.createWebhook(workspace.id, {
    endpoint: 'https://example.com/clickup-webhook-e2e',
    events: ['taskCreated', 'taskUpdated', 'taskStatusUpdated', 'taskCommentPosted'],
  });

  console.log(`✅ Created webhook: ${webhook.id}`);
  console.log(`   - Endpoint: ${webhook.endpoint}`);
  console.log(`   - Events: ${webhook.events.join(', ')}`);
  console.log(`   - Secret: ${webhook.secret.substring(0, 10)}...`);

  console.log('\n✏️  Step 8: Update the task (will trigger webhook)');
  await client.updateTask(task.id, {
    description: 'Updated description - this change will trigger the webhook',
    priority: 2,
  });

  console.log('✅ Task updated (webhook should receive event)');

  console.log('\n💬 Step 9: Add a comment');
  const comment = await client.createComment(task.id, {
    comment_text: 'This is an E2E test comment demonstrating the full workflow',
  });

  console.log(`✅ Comment added: ${comment.id}`);

  console.log('\n⏱️  Step 10: Add a time entry');
  const user = await client.getUser();
  const timeEntry = await client.createTimeEntry(workspace.id, {
    description: 'E2E workflow implementation',
    start: Date.now() - 7200000,
    duration: 7200000,
    assignee: user.id,
    billable: false,
    tid: task.id,
  });

  console.log(`✅ Time entry created: ${timeEntry.id} (2 hours)`);

  console.log('\n✅ Step 11: Add a checklist');
  const checklist = await client.createChecklist(task.id, {
    name: 'E2E Verification Steps',
  });

  await client.createChecklistItem(checklist.id, { name: 'Verify space created' });
  await client.createChecklistItem(checklist.id, { name: 'Verify folder created' });
  await client.createChecklistItem(checklist.id, { name: 'Verify list created' });
  await client.createChecklistItem(checklist.id, { name: 'Verify task created' });
  await client.createChecklistItem(checklist.id, { name: 'Verify webhook registered' });

  console.log(`✅ Checklist created with 5 items`);

  console.log('\n🧹 Step 12: Clean up webhook');
  await client.deleteWebhook(webhook.id);
  console.log('✅ Webhook deleted');

  console.log('\n' + '='.repeat(60));
  console.log('🎉 END-TO-END WORKFLOW COMPLETE!');
  console.log('='.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`   ✓ Space: ${space.name}`);
  console.log(`   ✓ Folder: ${folder.name}`);
  console.log(`   ✓ List: ${list.name}`);
  console.log(`   ✓ Task: ${task.name}`);
  console.log(`   ✓ Comment: 1`);
  console.log(`   ✓ Time Entry: 2 hours`);
  console.log(`   ✓ Checklist Items: 5`);
  console.log(`   ✓ Webhook: Created and cleaned up`);

  console.log('\n💡 Next Steps:');
  console.log('   - View the task in ClickUp UI');
  console.log('   - Clean up test data (space, folder, list, task)');
  console.log('   - Implement webhook endpoint for real-time events');
  console.log('   - Integrate with your application workflow');

  console.log('\n✅ All done! 🚀');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
