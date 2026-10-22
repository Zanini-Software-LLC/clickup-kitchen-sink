/**
 * ClickUp API v2 Client
 *
 * UNOFFICIAL reference implementation for educational purposes.
 * Not affiliated with or endorsed by ClickUp.
 *
 * @see https://developer.clickup.com/reference/
 */

import { HttpClient, HttpClientOptions } from './http.js';
import { User } from './types/user.js';
import { Workspace } from './types/workspace.js';
import { Space } from './types/space.js';
import { Folder } from './types/folder.js';
import { List } from './types/list.js';
import { Task, Dependency, Checklist, ChecklistItem } from './types/task.js';
import { logPagination } from '../utils/logger.js';

export class ClickUpClient {
  private http: HttpClient;

  constructor(apiToken: string, options?: HttpClientOptions) {
    this.http = new HttpClient(apiToken, options);
  }

  /**
   * Get authenticated user information
   *
   * @returns User information
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/getauthorizeduser
   * @example See examples/01-auth-user.ts
   */
  async getUser(): Promise<User> {
    const response = await this.http.get<{ user: User }>('/user');
    return response.user;
  }

  /**
   * Get accessible workspaces (teams)
   *
   * @returns Array of workspaces
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/getauthorizedteams
   * @example See examples/02-workspaces.ts
   */
  async getWorkspaces(): Promise<Workspace[]> {
    const response = await this.http.get<{ teams: Workspace[] }>('/team');
    return response.teams;
  }

  /**
   * Get spaces in a workspace
   *
   * @param workspaceId Workspace ID
   * @returns Array of spaces
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/getspaces
   * @example See examples/03-spaces.ts
   */
  async getSpaces(workspaceId: string): Promise<Space[]> {
    const response = await this.http.get<{ spaces: Space[] }>(`/team/${workspaceId}/space`);
    return response.spaces;
  }

  /**
   * Get a specific space
   *
   * @param spaceId Space ID
   * @returns Space details
   * @throws {ClickUpAPIError} If space not found (404)
   * @see https://developer.clickup.com/reference/getspace
   */
  async getSpace(spaceId: string): Promise<Space> {
    return await this.http.get<Space>(`/space/${spaceId}`);
  }

  /**
   * Get folders in a space
   *
   * @param spaceId Space ID
   * @returns Array of folders
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/getfolders
   * @example See examples/04-folders.ts
   */
  async getFolders(spaceId: string): Promise<Folder[]> {
    const response = await this.http.get<{ folders: Folder[] }>(`/space/${spaceId}/folder`);
    return response.folders;
  }

  /**
   * Get lists in a folder
   *
   * @param folderId Folder ID
   * @returns Array of lists
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/getlists
   * @example See examples/05-lists.ts
   */
  async getLists(folderId: string): Promise<List[]> {
    const response = await this.http.get<{ lists: List[] }>(`/folder/${folderId}/list`);
    return response.lists;
  }

  /**
   * Get folderless lists in a space
   *
   * @param spaceId Space ID
   * @returns Array of lists
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/getfolderlesslists
   */
  async getFolderlessLists(spaceId: string): Promise<List[]> {
    const response = await this.http.get<{ lists: List[] }>(`/space/${spaceId}/list`);
    return response.lists;
  }

  /**
   * Get a task by ID
   *
   * @param taskId Task ID
   * @param options Optional query parameters
   * @returns Task details
   * @throws {ClickUpAPIError} If task not found (404)
   * @see https://developer.clickup.com/reference/gettask
   * @example See examples/06-task-crud.ts
   */
  async getTask(
    taskId: string,
    options?: {
      custom_task_ids?: boolean;
      team_id?: string;
      include_subtasks?: boolean;
    },
  ): Promise<Task> {
    return await this.http.get<Task>(`/task/${taskId}`, { params: options });
  }

  /**
   * Create a new task
   *
   * @param listId List ID where task will be created
   * @param data Task creation data
   * @returns Created task
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/createtask
   * @example See examples/06-task-crud.ts
   */
  async createTask(
    listId: string,
    data: {
      name: string;
      description?: string;
      assignees?: number[];
      tags?: string[];
      status?: string;
      priority?: number;
      due_date?: number;
      due_date_time?: boolean;
      time_estimate?: number;
      start_date?: number;
      start_date_time?: boolean;
      notify_all?: boolean;
      parent?: string;
      links_to?: string;
      custom_fields?: Array<{ id: string; value: any }>;
    },
  ): Promise<Task> {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Task name is required');
    }
    return await this.http.post<Task>(`/list/${listId}/task`, data);
  }

  /**
   * Update a task
   *
   * @param taskId Task ID
   * @param data Task update data
   * @returns Updated task
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/updatetask
   * @example See examples/06-task-crud.ts
   */
  async updateTask(
    taskId: string,
    data: {
      name?: string;
      description?: string;
      status?: string;
      priority?: number | null;
      due_date?: number | null;
      due_date_time?: boolean;
      time_estimate?: number | null;
      start_date?: number | null;
      start_date_time?: boolean;
      assignees?: {
        add?: number[];
        rem?: number[];
      };
    },
  ): Promise<Task> {
    return await this.http.put<Task>(`/task/${taskId}`, data);
  }

  /**
   * Delete a task
   *
   * @param taskId Task ID
   * @throws {ClickUpAPIError} If task not found (404)
   * @see https://developer.clickup.com/reference/deletetask
   * @example See examples/06-task-crud.ts
   */
  async deleteTask(taskId: string): Promise<void> {
    await this.http.delete(`/task/${taskId}`);
  }

  /**
   * Get tasks in a list (single page)
   *
   * @param listId List ID
   * @param options Query options
   * @returns Tasks and optional cursor for next page
   * @see https://developer.clickup.com/reference/gettasks
   * @example See examples/24-pagination.ts
   */
  async getTasks(
    listId: string,
    options?: {
      archived?: boolean;
      page?: number;
      order_by?: string;
      reverse?: boolean;
      subtasks?: boolean;
      statuses?: string[];
      include_closed?: boolean;
      assignees?: number[];
      tags?: string[];
      due_date_gt?: number;
      due_date_lt?: number;
      date_created_gt?: number;
      date_created_lt?: number;
      date_updated_gt?: number;
      date_updated_lt?: number;
    },
  ): Promise<{ tasks: Task[]; cursor?: string }> {
    const response = await this.http.get<{ tasks: Task[]; last_page?: boolean }>(
      `/list/${listId}/task`,
      {
        params: options,
      },
    );
    return {
      tasks: response.tasks,
      cursor: response.last_page ? undefined : 'has_more',
    };
  }

  /**
   * Paginate through all tasks in a list
   * Automatically fetches all pages using cursor-based pagination (FR-006)
   *
   * @param listId List ID
   * @param options Query options
   * @yields Arrays of tasks for each page
   * @see https://developer.clickup.com/reference/gettasks
   * @example See examples/24-pagination.ts
   */
  async *paginateTasks(
    listId: string,
    options?: {
      archived?: boolean;
      order_by?: string;
      reverse?: boolean;
      subtasks?: boolean;
      statuses?: string[];
      include_closed?: boolean;
      assignees?: number[];
      tags?: string[];
    },
  ): AsyncGenerator<Task[], void, undefined> {
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      logPagination(`Fetching page ${page}`, { listId });
      const result = await this.getTasks(listId, { ...options, page });

      if (result.tasks.length > 0) {
        yield result.tasks;
        page++;
        hasMore = !!result.cursor;
      } else {
        hasMore = false;
      }
    }
  }

  /**
   * Add a dependency between tasks
   *
   * @param taskId Task ID that depends on another
   * @param dependsOn Task ID that this task depends on
   * @param dependencyOf Optional reverse dependency
   * @returns Dependency details
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/adddependency
   * @example See examples/08-dependencies.ts
   */
  async addDependency(
    taskId: string,
    dependsOn: string,
    dependencyOf?: string,
  ): Promise<Dependency> {
    return await this.http.post<Dependency>(`/task/${taskId}/dependency`, {
      depends_on: dependsOn,
      dependency_of: dependencyOf,
    });
  }

  /**
   * Delete a task dependency
   *
   * @param taskId Task ID
   * @param dependsOn Task ID to remove dependency from
   * @param dependencyOf Optional reverse dependency
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/deletedependency
   */
  async deleteDependency(taskId: string, dependsOn: string, dependencyOf?: string): Promise<void> {
    await this.http.delete(`/task/${taskId}/dependency`, {
      params: { depends_on: dependsOn, dependency_of: dependencyOf },
    });
  }

  /**
   * Create a checklist on a task
   *
   * @param taskId Task ID
   * @param data Checklist data
   * @returns Created checklist
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/createchecklist
   * @example See examples/09-checklists.ts
   */
  async createChecklist(taskId: string, data: { name: string }): Promise<Checklist> {
    return await this.http.post<Checklist>(`/task/${taskId}/checklist`, data);
  }

  /**
   * Create a checklist item
   *
   * @param checklistId Checklist ID
   * @param data Item data
   * @returns Created checklist item
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/createchecklistitem
   * @example See examples/09-checklists.ts
   */
  async createChecklistItem(
    checklistId: string,
    data: { name: string; assignee?: number },
  ): Promise<ChecklistItem> {
    return await this.http.post<ChecklistItem>(`/checklist/${checklistId}/checklist_item`, data);
  }

  /**
   * Add a tag to a task
   *
   * @param taskId Task ID
   * @param tagName Tag name
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/addtagtotask
   * @example See examples/10-tags.ts
   */
  async addTag(taskId: string, tagName: string): Promise<void> {
    await this.http.post(`/task/${taskId}/tag/${encodeURIComponent(tagName)}`);
  }

  /**
   * Remove a tag from a task
   *
   * @param taskId Task ID
   * @param tagName Tag name
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/removetagfromtask
   */
  async removeTag(taskId: string, tagName: string): Promise<void> {
    await this.http.delete(`/task/${taskId}/tag/${encodeURIComponent(tagName)}`);
  }
}

export * from './types/common.js';
export * from './types/user.js';
export * from './types/workspace.js';
export * from './types/space.js';
export * from './types/folder.js';
export * from './types/list.js';
export * from './types/task.js';
