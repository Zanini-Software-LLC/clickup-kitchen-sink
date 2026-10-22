/**
 * Unit tests for Goal operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { ClickUpClient } from '../../../src/client/index.js';

describe('ClickUpClient - Goals', () => {
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

  describe('getGoals', () => {
    it('should fetch goals for a workspace', async () => {
      const workspaceId = '123';
      const mockGoals = [
        { id: 'goal1', name: 'Q4 Goal' },
        { id: 'goal2', name: 'Annual Goal' },
      ];

      nock(BASE_URL).get(`/team/${workspaceId}/goal`).reply(200, { goals: mockGoals });

      const goals = await client.getGoals(workspaceId);
      expect(goals).toEqual(mockGoals);
      expect(goals.length).toBe(2);
    });
  });

  describe('createGoal', () => {
    it('should create a goal', async () => {
      const workspaceId = '123';
      const goalData = {
        name: 'New Goal',
        description: 'Goal description',
        due_date: Date.now() + 90 * 24 * 60 * 60 * 1000,
        color: '#32a852',
      };
      const mockResponse = {
        goal: {
          id: 'goal_new',
          name: 'New Goal',
          description: 'Goal description',
        },
      };

      nock(BASE_URL).post(`/team/${workspaceId}/goal`, goalData).reply(200, mockResponse);

      const goal = await client.createGoal(workspaceId, goalData);
      expect(goal).toEqual(mockResponse.goal);
    });
  });
});
