/**
 * Unit tests for HTTP client with retry logic
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { HttpClient } from '../../../src/client/http.js';
import { ClickUpAPIError } from '../../../src/client/types/common.js';

describe('HttpClient', () => {
  const baseURL = 'https://api.clickup.com/api/v2';
  const apiToken = 'test_token_12345';
  let client: HttpClient;

  beforeEach(() => {
    client = new HttpClient(apiToken, { timeout: 5000, maxRetries: 3 });
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Basic HTTP operations', () => {
    it('should make GET request with authorization header', async () => {
      nock(baseURL)
        .get('/user')
        .matchHeader('authorization', apiToken)
        .reply(200, { user: { id: 123, username: 'test' } });

      const result = await client.get('/user');
      expect(result).toEqual({ user: { id: 123, username: 'test' } });
    });

    it('should make POST request', async () => {
      nock(baseURL).post('/list/456/task', { name: 'Test Task' }).reply(200, { id: '789' });

      const result = await client.post('/list/456/task', { name: 'Test Task' });
      expect(result).toEqual({ id: '789' });
    });

    it('should make PUT request', async () => {
      nock(baseURL).put('/task/789', { name: 'Updated Task' }).reply(200, { id: '789' });

      const result = await client.put('/task/789', { name: 'Updated Task' });
      expect(result).toEqual({ id: '789' });
    });

    it('should make DELETE request', async () => {
      nock(baseURL).delete('/task/789').reply(200, {});

      const result = await client.delete('/task/789');
      expect(result).toEqual({});
    });
  });

  describe('Error handling', () => {
    it('should throw ClickUpAPIError on 401', async () => {
      nock(baseURL).get('/user').reply(401, { err: 'Invalid token', ECODE: 'OAUTH_027' });

      try {
        await client.get('/user');
        expect.fail('Should have thrown ClickUpAPIError');
      } catch (error) {
        expect(error).toBeInstanceOf(ClickUpAPIError);
        expect((error as ClickUpAPIError).statusCode).toBe(401);
        expect((error as ClickUpAPIError).errorCode).toBe('OAUTH_027');
      }
    });

    it('should throw ClickUpAPIError on 404', async () => {
      nock(baseURL).get('/task/invalid').reply(404, { err: 'Task not found' });

      try {
        await client.get('/task/invalid');
        expect.fail('Should have thrown ClickUpAPIError');
      } catch (error) {
        expect(error).toBeInstanceOf(ClickUpAPIError);
        expect((error as ClickUpAPIError).statusCode).toBe(404);
      }
    });
  });

  describe('Rate limiting and retry', () => {
    it('should retry on 429 with exponential backoff', async () => {
      // First attempt: 429
      nock(baseURL).get('/user').reply(429, { err: 'Rate limited' }, { 'retry-after': '1' });

      // Second attempt: success
      nock(baseURL).get('/user').reply(200, { user: { id: 123 } });

      const result = await client.get('/user');
      expect(result).toEqual({ user: { id: 123 } });
    });

    it('should respect Retry-After header', async () => {
      nock(baseURL).get('/user').reply(429, { err: 'Rate limited' }, { 'retry-after': '2' });
      nock(baseURL).get('/user').reply(200, { user: { id: 123 } });

      const startTime = Date.now();
      await client.get('/user');
      const duration = Date.now() - startTime;

      // Should wait at least 2 seconds (2000ms)
      expect(duration).toBeGreaterThanOrEqual(1900); // Allow small margin
    });

    it('should fail after max retries', async () => {
      // Mock 4 failures (maxRetries = 3, so 1 initial + 3 retries = 4 total attempts)
      for (let i = 0; i < 4; i++) {
        nock(baseURL).get('/user').reply(429, { err: 'Rate limited' }, { 'retry-after': '0' });
      }

      try {
        await client.get('/user');
        expect.fail('Should have thrown ClickUpAPIError');
      } catch (error) {
        expect(error).toBeInstanceOf(ClickUpAPIError);
        expect((error as ClickUpAPIError).statusCode).toBe(429);
      }
    });
  });

  describe('Timeout', () => {
    it('should timeout after specified duration', async () => {
      nock(baseURL)
        .get('/user')
        .delay(6000) // Delay longer than 5s timeout
        .reply(200, { user: { id: 123 } });

      await expect(client.get('/user')).rejects.toThrow();
    });
  });
});
