/**
 * Unit tests for Webhook operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { ClickUpClient } from '../../../src/client/index.js';

describe('ClickUpClient - Webhooks', () => {
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

  describe('createWebhook', () => {
    it('should create a webhook', async () => {
      const workspaceId = '123';
      const webhookData = {
        endpoint: 'https://example.com/webhook',
        events: ['taskCreated' as const, 'taskUpdated' as const],
      };
      const mockResponse = {
        id: 'webhook1',
        endpoint: 'https://example.com/webhook',
        events: ['taskCreated', 'taskUpdated'],
        secret: 'secret123',
      };

      nock(BASE_URL).post(`/team/${workspaceId}/webhook`, webhookData).reply(200, mockResponse);

      const webhook = await client.createWebhook(workspaceId, webhookData);
      expect(webhook).toEqual(mockResponse);
      expect(webhook.events).toContain('taskCreated');
    });
  });

  describe('getWebhooks', () => {
    it('should fetch webhooks for a workspace', async () => {
      const workspaceId = '123';
      const mockWebhooks = [
        { id: 'webhook1', endpoint: 'https://example.com/1', events: [] },
        { id: 'webhook2', endpoint: 'https://example.com/2', events: [] },
      ];

      nock(BASE_URL).get(`/team/${workspaceId}/webhook`).reply(200, { webhooks: mockWebhooks });

      const webhooks = await client.getWebhooks(workspaceId);
      expect(webhooks).toEqual(mockWebhooks);
      expect(webhooks.length).toBe(2);
    });
  });

  describe('updateWebhook', () => {
    it('should update a webhook', async () => {
      const webhookId = 'webhook1';
      const updateData = {
        events: ['taskDeleted' as const],
      };
      const mockResponse = {
        id: webhookId,
        events: ['taskDeleted'],
      };

      nock(BASE_URL).put(`/webhook/${webhookId}`, updateData).reply(200, mockResponse);

      const webhook = await client.updateWebhook(webhookId, updateData);
      expect(webhook).toEqual(mockResponse);
    });
  });

  describe('deleteWebhook', () => {
    it('should delete a webhook', async () => {
      const webhookId = 'webhook1';

      nock(BASE_URL).delete(`/webhook/${webhookId}`).reply(200, {});

      await client.deleteWebhook(webhookId);
    });
  });
});
