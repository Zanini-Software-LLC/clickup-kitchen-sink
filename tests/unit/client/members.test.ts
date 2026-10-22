/**
 * Unit tests for Member operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { ClickUpClient } from '../../../src/client/index.js';

describe('ClickUpClient - Members', () => {
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

  describe('getWorkspaceMembers', () => {
    it('should fetch members for a workspace', async () => {
      const workspaceId = '123';
      const mockMembers = [
        {
          user: { id: 1, username: 'user1', email: 'user1@example.com' },
          invited_by: null,
        },
        {
          user: { id: 2, username: 'user2', email: 'user2@example.com' },
          invited_by: { id: 1, username: 'user1' },
        },
      ];

      nock(BASE_URL).get(`/team/${workspaceId}/member`).reply(200, { members: mockMembers });

      const members = await client.getWorkspaceMembers(workspaceId);
      expect(members).toEqual(mockMembers);
      expect(members.length).toBe(2);
    });
  });
});
