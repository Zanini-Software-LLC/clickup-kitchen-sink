/**
 * Unit tests for Comment operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { ClickUpClient } from '../../../src/client/index.js';

describe('ClickUpClient - Comments', () => {
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

  describe('getComments', () => {
    it('should fetch comments for a task', async () => {
      const taskId = 'task123';
      const mockComments = [
        { id: 'comment1', comment_text: 'First comment' },
        { id: 'comment2', comment_text: 'Second comment' },
      ];

      nock(BASE_URL).get(`/task/${taskId}/comment`).reply(200, { comments: mockComments });

      const comments = await client.getComments(taskId);
      expect(comments).toEqual(mockComments);
      expect(comments.length).toBe(2);
    });
  });

  describe('createComment', () => {
    it('should create a comment on a task', async () => {
      const taskId = 'task123';
      const commentData = {
        comment_text: 'This is a test comment',
        notify_all: true,
      };
      const mockResponse = {
        id: 'comment_new',
        comment_text: 'This is a test comment',
      };

      nock(BASE_URL).post(`/task/${taskId}/comment`, commentData).reply(200, mockResponse);

      const comment = await client.createComment(taskId, commentData);
      expect(comment).toEqual(mockResponse);
    });

    it('should create a comment with assignee', async () => {
      const taskId = 'task123';
      const commentData = {
        comment_text: 'Assigned comment',
        assignee: 456,
      };
      const mockResponse = {
        id: 'comment_new',
        comment_text: 'Assigned comment',
      };

      nock(BASE_URL).post(`/task/${taskId}/comment`, commentData).reply(200, mockResponse);

      const comment = await client.createComment(taskId, commentData);
      expect(comment).toEqual(mockResponse);
    });
  });
});
