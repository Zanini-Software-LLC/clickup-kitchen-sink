/**
 * Integration tests for Webhook operations
 *
 * These tests require CLICKUP_API_TOKEN to be set.
 * They will create and clean up real webhooks in ClickUp.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ClickUpClient } from '../../src/client/index.js';

const API_TOKEN = process.env.CLICKUP_API_TOKEN;

describe.skipIf(!API_TOKEN)('Webhook Integration Tests', () => {
  let client: ClickUpClient;
  let workspaceId: string;
  const createdWebhookIds: string[] = [];

  beforeAll(async () => {
    if (!API_TOKEN) return;

    client = new ClickUpClient(API_TOKEN);

    const workspaces = await client.getWorkspaces();
    workspaceId = workspaces[0].id;
  });

  afterAll(async () => {
    if (!API_TOKEN || !client) return;

    for (const webhookId of createdWebhookIds) {
      try {
        await client.deleteWebhook(webhookId);
      } catch (error) {
        console.warn(`Failed to clean up webhook ${webhookId}:`, error);
      }
    }
  });

  it('should create a webhook', async () => {
    const webhook = await client.createWebhook(workspaceId, {
      endpoint: 'https://example.com/test-webhook',
      events: ['taskCreated', 'taskUpdated'],
    });

    expect(webhook).toBeDefined();
    expect(webhook.id).toBeDefined();
    expect(webhook.endpoint).toBe('https://example.com/test-webhook');
    expect(webhook.secret).toBeDefined();
    createdWebhookIds.push(webhook.id);
  });

  it('should list webhooks', async () => {
    const webhooks = await client.getWebhooks(workspaceId);

    expect(webhooks).toBeDefined();
    expect(Array.isArray(webhooks)).toBe(true);
  });

  it('should update a webhook', async () => {
    const webhook = await client.createWebhook(workspaceId, {
      endpoint: 'https://example.com/webhook-update-test',
      events: ['taskCreated'],
    });
    createdWebhookIds.push(webhook.id);

    const updated = await client.updateWebhook(webhook.id, {
      events: ['taskCreated', 'taskDeleted'],
    });

    expect(updated.events).toContain('taskCreated');
    expect(updated.events).toContain('taskDeleted');
  });

  it('should delete a webhook', async () => {
    const webhook = await client.createWebhook(workspaceId, {
      endpoint: 'https://example.com/webhook-delete-test',
      events: ['taskCreated'],
    });

    await client.deleteWebhook(webhook.id);

    const webhooks = await client.getWebhooks(workspaceId);
    expect(webhooks.some((w) => w.id === webhook.id)).toBe(false);
  });
});
