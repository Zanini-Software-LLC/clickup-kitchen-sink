/**
 * Unit tests for Time Tracking operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { ClickUpClient } from '../../../src/client/index.js';

describe('ClickUpClient - Time Tracking', () => {
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

  describe('createTimeEntry', () => {
    it('should create a time entry', async () => {
      const workspaceId = '123';
      const timeEntryData = {
        description: 'Worked on feature',
        start: Date.now() - 3600000,
        duration: 3600000,
        assignee: 456,
        billable: false,
      };
      const mockResponse = {
        data: {
          id: 'entry1',
          description: 'Worked on feature',
          duration: '3600000',
        },
      };

      nock(BASE_URL)
        .post(`/team/${workspaceId}/time_entries`, timeEntryData)
        .reply(200, mockResponse);

      const timeEntry = await client.createTimeEntry(workspaceId, timeEntryData);
      expect(timeEntry).toEqual(mockResponse.data);
    });
  });

  describe('getTimeEntries', () => {
    it('should fetch time entries for a workspace', async () => {
      const workspaceId = '123';
      const mockEntries = [
        { id: 'entry1', description: 'Entry 1', duration: '3600000' },
        { id: 'entry2', description: 'Entry 2', duration: '7200000' },
      ];

      nock(BASE_URL).get(`/team/${workspaceId}/time_entries`).reply(200, { data: mockEntries });

      const entries = await client.getTimeEntries(workspaceId);
      expect(entries).toEqual(mockEntries);
      expect(entries.length).toBe(2);
    });

    it('should fetch time entries with filters', async () => {
      const workspaceId = '123';
      const params = {
        assignee: 456,
        start_date: 1000000,
        end_date: 2000000,
      };
      const mockEntries = [{ id: 'entry1', description: 'Filtered Entry', duration: '3600000' }];

      nock(BASE_URL)
        .get(`/team/${workspaceId}/time_entries`)
        .query(params)
        .reply(200, { data: mockEntries });

      const entries = await client.getTimeEntries(workspaceId, params);
      expect(entries).toEqual(mockEntries);
    });
  });
});
