/**
 * Unit tests for Custom Field operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { ClickUpClient } from '../../../src/client/index.js';

describe('ClickUpClient - Custom Fields', () => {
  const API_TOKEN = 'test_token';
  const BASE_URL = 'https://api.clickup.com/api/v2';
  let client: ClickUpClient;

  beforeEach(() => {
    client = new ClickUpClient(API_TOKEN);
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe('getCustomFields', () => {
    it('should fetch custom fields for a list', async () => {
      const listId = 'list123';
      const mockFields = [
        { id: 'field1', name: 'Priority Score', type: 'number' },
        { id: 'field2', name: 'Status', type: 'drop_down' },
      ];

      nock(BASE_URL).get(`/list/${listId}/field`).reply(200, { fields: mockFields });

      const fields = await client.getCustomFields(listId);
      expect(fields).toEqual(mockFields);
      expect(fields.length).toBe(2);
    });
  });

  describe('setCustomFieldValue', () => {
    it('should set a custom field value on a task', async () => {
      const taskId = 'task123';
      const fieldId = 'field1';
      const value = 42;

      nock(BASE_URL).post(`/task/${taskId}/field/${fieldId}`, { value }).reply(200, {});

      await client.setCustomFieldValue(taskId, fieldId, value);
    });

    it('should set a text custom field value', async () => {
      const taskId = 'task123';
      const fieldId = 'field2';
      const value = 'Test Value';

      nock(BASE_URL).post(`/task/${taskId}/field/${fieldId}`, { value }).reply(200, {});

      await client.setCustomFieldValue(taskId, fieldId, value);
    });

    it('should set a boolean custom field value', async () => {
      const taskId = 'task123';
      const fieldId = 'field3';
      const value = true;

      nock(BASE_URL).post(`/task/${taskId}/field/${fieldId}`, { value }).reply(200, {});

      await client.setCustomFieldValue(taskId, fieldId, value);
    });
  });
});
