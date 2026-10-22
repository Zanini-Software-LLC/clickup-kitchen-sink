/**
 * Example 20: Goals
 *
 * Demonstrates:
 * - Creating a goal
 * - Fetching goals for a workspace
 *
 * @see https://developer.clickup.com/reference/creategoal
 * @see https://developer.clickup.com/reference/getgoals
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

  console.log('\n🎯 Creating a goal...');
  const goal = await client.createGoal(workspaceId, {
    name: `Q4 API Integration Goal ${Date.now()}`,
    description: 'Complete ClickUp API v2 integration with all endpoints',
    due_date: Date.now() + 90 * 24 * 60 * 60 * 1000,
    color: '#32a852',
  });

  console.log(`✅ Created goal: ${goal.name} (${goal.id})`);
  console.log(`   - Description: ${goal.description}`);
  console.log(`   - Due Date: ${goal.due_date ? new Date(parseInt(goal.due_date)).toISOString() : 'None'}`);
  console.log(`   - Color: ${goal.color}`);
  console.log(`   - Completion: ${goal.percent_completed}%`);

  console.log('\n📊 Fetching all goals...');
  const goals = await client.getGoals(workspaceId);
  console.log(`✅ Found ${goals.length} goal(s):`);

  goals.forEach((g, index) => {
    console.log(`  ${index + 1}. ${g.name} (${g.id})`);
    console.log(`     - Progress: ${g.percent_completed}%`);
    console.log(`     - Key Results: ${g.key_results.length}`);
    console.log(`     - Owners: ${g.owners.map((o) => o.username).join(', ') || 'None'}`);
  });

  console.log('\n✅ Goal operations complete!');
  console.log('💡 Clean up goals in ClickUp after experimenting.');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
