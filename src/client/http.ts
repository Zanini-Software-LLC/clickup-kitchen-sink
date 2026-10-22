/**
 * HTTP client with retry logic, rate limiting, and timeout
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ClickUpAPIError } from './types/common.js';
import { logHttp, logRetry } from '../utils/logger.js';

export interface HttpClientOptions {
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
  debug?: boolean;
}

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private maxRetries: number;

  constructor(apiToken: string, options: HttpClientOptions = {}) {
    const {
      baseURL = 'https://api.clickup.com/api/v2',
      timeout = 30000,
      maxRetries = 5,
    } = options;

    this.maxRetries = maxRetries;

    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        Authorization: apiToken,
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for retry logic
    this.axiosInstance.interceptors.response.use(
      (response) => {
        logHttp('Response received', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      async (error: AxiosError) => {
        const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };

        if (!config) {
          throw error;
        }

        // Handle rate limiting (429)
        if (error.response?.status === 429) {
          const retryCount = config._retryCount || 0;

          if (retryCount < this.maxRetries) {
            config._retryCount = retryCount + 1;

            // Get retry delay from Retry-After header or use exponential backoff
            const retryAfter = error.response.headers['retry-after'];
            const delay = retryAfter
              ? parseInt(retryAfter) * 1000
              : Math.pow(2, retryCount) * 1000;

            logRetry(`Rate limited, retry ${retryCount + 1}/${this.maxRetries}`, {
              delay: `${delay}ms`,
              url: config.url,
            });

            await new Promise((resolve) => setTimeout(resolve, delay));
            return this.axiosInstance(config);
          }

          logRetry(`Max retries (${this.maxRetries}) exceeded`, { url: config.url });
        }

        // Convert to ClickUpAPIError
        const status = error.response?.status || 0;
        const errorData = error.response?.data as any;
        const errorCode = errorData?.ECODE;
        const errorMessage = errorData?.err || error.message;

        throw new ClickUpAPIError(errorMessage, status, errorCode, error.response?.data);
      },
    );

    // Request interceptor for logging
    this.axiosInstance.interceptors.request.use((config) => {
      logHttp('Request', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
      });
      return config;
    });
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}
