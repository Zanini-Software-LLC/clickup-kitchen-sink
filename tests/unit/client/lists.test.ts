/**
 * Unit tests for List operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { ClickUpClient } from '../../../src/client/index.js';

describe('ClickUpClient - Lists', () => {
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

  describe('getLists', () => {
    it('should fetch lists for a folder', async () => {
      const folderId = 'folder123';
      const mockLists = [
        { id: 'list1', name: 'List 1' },
        { id: 'list2', name: 'List 2' },
      ];

      nock(BASE_URL).get(`/folder/${folderId}/list`).reply(200, { lists: mockLists });

      const lists = await client.getLists(folderId);
      expect(lists).toEqual(mockLists);
      expect(lists.length).toBe(2);
    });
  });

  describe('getFolderlessLists', () => {
    it('should fetch folderless lists for a space', async () => {
      const spaceId = 'space123';
      const mockLists = [{ id: 'list1', name: 'Folderless List' }];

      nock(BASE_URL).get(`/space/${spaceId}/list`).reply(200, { lists: mockLists });

      const lists = await client.getFolderlessLists(spaceId);
      expect(lists).toEqual(mockLists);
    });
  });

  describe('createList', () => {
    it('should create a list in a folder', async () => {
      const folderId = 'folder123';
      const listData = {
        name: 'New List',
        content: 'List description',
        priority: 2,
      };
      const mockResponse = { id: 'list_new', name: 'New List' };

      nock(BASE_URL).post(`/folder/${folderId}/list`, listData).reply(200, mockResponse);

      const list = await client.createList(folderId, listData);
      expect(list).toEqual(mockResponse);
    });
  });

  describe('createFolderlessList', () => {
    it('should create a folderless list in a space', async () => {
      const spaceId = 'space123';
      const listData = {
        name: 'Folderless List',
        content: 'Description',
      };
      const mockResponse = { id: 'list_new', name: 'Folderless List' };

      nock(BASE_URL).post(`/space/${spaceId}/list`, listData).reply(200, mockResponse);

      const list = await client.createFolderlessList(spaceId, listData);
      expect(list).toEqual(mockResponse);
    });
  });
});
