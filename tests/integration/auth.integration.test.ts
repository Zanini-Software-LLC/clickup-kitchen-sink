/**
 * Integration tests for authentication
 * Skips if CLICKUP_API_TOKEN not set
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnvironment, TestContext } from './setup.js';

describe.skipIf(!process.env.CLICKUP_API_TOKEN)('Authentication Integration', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await setupTestEnvironment();
  });

  afterAll(async () => {
    if (context) {
      await context.cleanup();
    }
  });

  it('should authenticate and get user info', async () => {
    const user = await context.client.getUser();

    expect(user).toBeDefined();
    expect(user.id).toBeTypeOf('number');
    expect(user.email).toBeTypeOf('string');
    expect(user.username).toBeTypeOf('string');
  });

  it('should list workspaces', async () => {
    const workspaces = await context.client.getWorkspaces();

    expect(Array.isArray(workspaces)).toBe(true);
    expect(workspaces.length).toBeGreaterThan(0);
    expect(workspaces[0].id).toBeDefined();
    expect(workspaces[0].name).toBeDefined();
  });
});
