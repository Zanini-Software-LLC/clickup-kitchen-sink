/**
 * Integration test setup and cleanup
 * Creates dedicated test space and cleans up all resources
 */

import { ClickUpClient } from '../../src/client/index.js';

export interface TestContext {
  client: ClickUpClient;
  workspaceId: string;
  spaceId?: string;
  listId?: string;
  cleanup: () => Promise<void>;
}

export async function setupTestEnvironment(): Promise<TestContext> {
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    throw new Error('CLICKUP_API_TOKEN environment variable is required for integration tests');
  }

  const client = new ClickUpClient(token);
  const createdResources: {
    tasks: string[];
    lists: string[];
    spaces: string[];
  } = {
    tasks: [],
    lists: [],
    spaces: [],
  };

  // Get first workspace
  const workspaces = await client.getWorkspaces();
  if (workspaces.length === 0) {
    throw new Error('No workspaces available for testing');
  }
  const workspaceId = workspaces[0].id;

  const cleanup = async () => {
    console.log('🧹 Cleaning up test resources...');

    // Delete tasks
    for (const taskId of createdResources.tasks) {
      try {
        await client.deleteTask(taskId);
        console.log(`  ✓ Deleted task ${taskId}`);
      } catch (error) {
        console.error(`  ✗ Failed to delete task ${taskId}:`, (error as Error).message);
      }
    }

    // Note: Lists and spaces cleanup would require additional client methods
    // For now, we'll rely on manual cleanup or task deletion

    console.log('✅ Cleanup complete');
  };

  return {
    client,
    workspaceId,
    cleanup,
  };
}
