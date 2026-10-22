/**
 * Unit tests for Folder operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { ClickUpClient } from '../../../src/client/index.js';

describe('ClickUpClient - Folders', () => {
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

  describe('getFolders', () => {
    it('should fetch folders for a space', async () => {
      const spaceId = 'space123';
      const mockFolders = [
        { id: 'folder1', name: 'Folder 1' },
        { id: 'folder2', name: 'Folder 2' },
      ];

      nock(BASE_URL).get(`/space/${spaceId}/folder`).reply(200, { folders: mockFolders });

      const folders = await client.getFolders(spaceId);
      expect(folders).toEqual(mockFolders);
      expect(folders.length).toBe(2);
    });
  });

  describe('createFolder', () => {
    it('should create a folder', async () => {
      const spaceId = 'space123';
      const folderData = { name: 'New Folder' };
      const mockResponse = { id: 'folder_new', name: 'New Folder' };

      nock(BASE_URL).post(`/space/${spaceId}/folder`, folderData).reply(200, mockResponse);

      const folder = await client.createFolder(spaceId, folderData);
      expect(folder).toEqual(mockResponse);
    });
  });
});
