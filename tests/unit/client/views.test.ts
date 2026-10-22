/**
 * Unit tests for View operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { ClickUpClient } from '../../../src/client/index.js';

describe('ClickUpClient - Views', () => {
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

  describe('getViews', () => {
    it('should fetch workspace views', async () => {
      const workspaceId = '123';
      const mockViews = [
        { id: 'view1', name: 'Board View', type: 'board' as const },
        { id: 'view2', name: 'List View', type: 'list' as const },
      ];

      nock(BASE_URL).get(`/team/${workspaceId}/view`).reply(200, { views: mockViews });

      const views = await client.getViews(workspaceId);
      expect(views).toEqual(mockViews);
      expect(views.length).toBe(2);
    });
  });

  describe('getSpaceViews', () => {
    it('should fetch space views', async () => {
      const spaceId = 'space123';
      const mockViews = [{ id: 'view1', name: 'Calendar View', type: 'calendar' as const }];

      nock(BASE_URL).get(`/space/${spaceId}/view`).reply(200, { views: mockViews });

      const views = await client.getSpaceViews(spaceId);
      expect(views).toEqual(mockViews);
    });
  });

  describe('getListViews', () => {
    it('should fetch list views', async () => {
      const listId = 'list123';
      const mockViews = [{ id: 'view1', name: 'Gantt View', type: 'gantt' as const }];

      nock(BASE_URL).get(`/list/${listId}/view`).reply(200, { views: mockViews });

      const views = await client.getListViews(listId);
      expect(views).toEqual(mockViews);
    });
  });
});
