/**
 * Integration tests for Time Tracking operations
 *
 * These tests require CLICKUP_API_TOKEN to be set.
 * They will create real time entries.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { ClickUpClient } from '../../src/client/index.js';

const API_TOKEN = process.env.CLICKUP_API_TOKEN;

describe.skipIf(!API_TOKEN)('Time Tracking Integration Tests', () => {
  let client: ClickUpClient;
  let workspaceId: string;
  let userId: number;

  beforeAll(async () => {
    if (!API_TOKEN) return;

    client = new ClickUpClient(API_TOKEN);

    const workspaces = await client.getWorkspaces();
    workspaceId = workspaces[0].id;

    const user = await client.getUser();
    userId = user.id;
  });

  it('should create a time entry', async () => {
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    const timeEntry = await client.createTimeEntry(workspaceId, {
      description: 'Integration test time entry',
      start: oneHourAgo,
      duration: 3600000,
      assignee: userId,
      billable: false,
    });

    expect(timeEntry).toBeDefined();
    expect(timeEntry.id).toBeDefined();
    expect(timeEntry.description).toBe('Integration test time entry');
  });

  it('should fetch time entries', async () => {
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    const entries = await client.getTimeEntries(workspaceId, {
      start_date: oneHourAgo,
      end_date: now,
      assignee: userId,
    });

    expect(entries).toBeDefined();
    expect(Array.isArray(entries)).toBe(true);
  });
});
