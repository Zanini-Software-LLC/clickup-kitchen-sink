/**
 * Integration tests for Custom Field operations
 *
 * These tests require CLICKUP_API_TOKEN to be set.
 * They will fetch custom fields from a real list.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { ClickUpClient } from '../../src/client/index.js';

const API_TOKEN = process.env.CLICKUP_API_TOKEN;

describe.skipIf(!API_TOKEN)('Custom Field Integration Tests', () => {
  let client: ClickUpClient;
  let workspaceId: string;
  let spaceId: string;
  let listId: string;

  beforeAll(async () => {
    if (!API_TOKEN) return;

    client = new ClickUpClient(API_TOKEN);

    const workspaces = await client.getWorkspaces();
    workspaceId = workspaces[0].id;

    const spaces = await client.getSpaces(workspaceId);
    spaceId = spaces[0].id;

    let lists = await client.getFolderlessLists(spaceId);
    if (lists.length === 0) {
      const newList = await client.createFolderlessList(spaceId, {
        name: 'Integration Test List (Auto)',
      });
      listId = newList.id;
    } else {
      listId = lists[0].id;
    }
  });

  it('should fetch custom fields for a list', async () => {
    const fields = await client.getCustomFields(listId);

    expect(fields).toBeDefined();
    expect(Array.isArray(fields)).toBe(true);
  });

  it('should set custom field value if fields exist', async () => {
    const fields = await client.getCustomFields(listId);

    if (fields.length > 0) {
      const task = await client.createTask(listId, {
        name: 'Task for Custom Field Test',
      });

      const field = fields[0];
      let value: string | number | boolean;

      if (field.type === 'text' || field.type === 'url' || field.type === 'email') {
        value = 'Test Value';
      } else if (field.type === 'number' || field.type === 'currency') {
        value = 42;
      } else if (field.type === 'checkbox') {
        value = true;
      } else {
        value = 'Test';
      }

      await client.setCustomFieldValue(task.id, field.id, value);

      const updatedTask = await client.getTask(task.id);
      expect(updatedTask.custom_fields).toBeDefined();

      await client.deleteTask(task.id);
    }
  });
});
