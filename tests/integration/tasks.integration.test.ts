/**
 * Integration tests for Task operations
 *
 * These tests require CLICKUP_API_TOKEN to be set.
 * They will create and clean up real resources in ClickUp.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ClickUpClient } from '../../src/client/index.js';

const API_TOKEN = process.env.CLICKUP_API_TOKEN;

describe.skipIf(!API_TOKEN)('Task Integration Tests', () => {
  let client: ClickUpClient;
  let workspaceId: string;
  let spaceId: string;
  let listId: string;
  const createdTaskIds: string[] = [];

  beforeAll(async () => {
    if (!API_TOKEN) return;

    client = new ClickUpClient(API_TOKEN);

    const workspaces = await client.getWorkspaces();
    workspaceId = workspaces[0].id;

    const spaces = await client.getSpaces(workspaceId);
    spaceId = spaces[0].id;

    const lists = await client.getFolderlessLists(spaceId);
    if (lists.length === 0) {
      const newList = await client.createFolderlessList(spaceId, {
        name: 'Integration Test List (Auto)',
      });
      listId = newList.id;
    } else {
      listId = lists[0].id;
    }
  });

  afterAll(async () => {
    if (!API_TOKEN || !client) return;

    for (const taskId of createdTaskIds) {
      try {
        await client.deleteTask(taskId);
      } catch (error) {
        console.warn(`Failed to clean up task ${taskId}:`, error);
      }
    }
  });

  it('should create a task', async () => {
    const task = await client.createTask(listId, {
      name: 'Integration Test Task',
      description: 'Created by automated integration test',
      priority: 3,
    });

    expect(task).toBeDefined();
    expect(task.id).toBeDefined();
    expect(task.name).toBe('Integration Test Task');
    createdTaskIds.push(task.id);
  });

  it('should get a task by ID', async () => {
    const createdTask = await client.createTask(listId, {
      name: 'Task for Get Test',
    });
    createdTaskIds.push(createdTask.id);

    const fetchedTask = await client.getTask(createdTask.id);
    expect(fetchedTask).toBeDefined();
    expect(fetchedTask.id).toBe(createdTask.id);
    expect(fetchedTask.name).toBe('Task for Get Test');
  });

  it('should update a task', async () => {
    const task = await client.createTask(listId, {
      name: 'Task for Update Test',
    });
    createdTaskIds.push(task.id);

    const updatedTask = await client.updateTask(task.id, {
      name: 'Task for Update Test (UPDATED)',
      description: 'Updated description',
      priority: 1,
    });

    expect(updatedTask.name).toBe('Task for Update Test (UPDATED)');
    expect(updatedTask.description).toBe('Updated description');
  });

  it('should list tasks in a list', async () => {
    const result = await client.getTasks(listId, { include_closed: true });

    expect(result).toBeDefined();
    expect(result.tasks).toBeDefined();
    expect(Array.isArray(result.tasks)).toBe(true);
  });

  it('should add and remove a tag from a task', async () => {
    const task = await client.createTask(listId, {
      name: 'Task for Tag Test',
    });
    createdTaskIds.push(task.id);

    await client.addTag(task.id, 'test-tag');
    const taskWithTag = await client.getTask(task.id);
    expect(taskWithTag.tags.some((t) => t.name === 'test-tag')).toBe(true);

    await client.removeTag(task.id, 'test-tag');
    const taskWithoutTag = await client.getTask(task.id);
    expect(taskWithoutTag.tags.some((t) => t.name === 'test-tag')).toBe(false);
  });

  it('should delete a task', async () => {
    const task = await client.createTask(listId, {
      name: 'Task for Delete Test',
    });

    await client.deleteTask(task.id);

    try {
      await client.getTask(task.id);
      expect.fail('Task should have been deleted');
    } catch (error: any) {
      expect(error.statusCode).toBe(404);
    }
  });
});
