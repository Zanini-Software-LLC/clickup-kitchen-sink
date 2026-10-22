/**
 * Unit tests for Space operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { ClickUpClient } from '../../../src/client/index.js';

describe('ClickUpClient - Spaces', () => {
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

  describe('getSpaces', () => {
    it('should fetch spaces for a workspace', async () => {
      const workspaceId = '123';
      const mockSpaces = [
        { id: 'space1', name: 'Test Space 1' },
        { id: 'space2', name: 'Test Space 2' },
      ];

      nock(BASE_URL).get(`/team/${workspaceId}/space`).reply(200, { spaces: mockSpaces });

      const spaces = await client.getSpaces(workspaceId);
      expect(spaces).toEqual(mockSpaces);
      expect(spaces.length).toBe(2);
    });
  });

  describe('getSpace', () => {
    it('should fetch a specific space', async () => {
      const spaceId = 'space1';
      const mockSpace = { id: spaceId, name: 'Test Space' };

      nock(BASE_URL).get(`/space/${spaceId}`).reply(200, mockSpace);

      const space = await client.getSpace(spaceId);
      expect(space).toEqual(mockSpace);
    });
  });

  describe('createSpace', () => {
    it('should create a new space', async () => {
      const workspaceId = '123';
      const spaceData = {
        name: 'New Space',
        multiple_assignees: true,
      };
      const mockResponse = { id: 'space_new', name: 'New Space' };

      nock(BASE_URL).post(`/team/${workspaceId}/space`, spaceData).reply(200, mockResponse);

      const space = await client.createSpace(workspaceId, spaceData);
      expect(space).toEqual(mockResponse);
    });
  });
});
