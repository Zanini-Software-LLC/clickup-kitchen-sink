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
import { CustomField, CustomFieldValue } from './types/custom-field.js';
import { Webhook, WebhookEvent } from './types/webhook.js';
import { Comment } from './types/comment.js';
import { TimeEntry } from './types/time-entry.js';
import { Goal, KeyResult } from './types/goal.js';
import { View } from './types/view.js';
import { Member } from './types/member.js';
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

  /**
   * Create a space
   *
   * @param workspaceId Workspace ID
   * @param data Space creation data
   * @returns Created space
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/createspace
   * @example See examples/03-spaces.ts
   */
  async createSpace(
    workspaceId: string,
    data: {
      name: string;
      multiple_assignees?: boolean;
      features?: {
        due_dates?: { enabled: boolean; start_date: boolean; remap_due_dates: boolean; remap_closed_due_date: boolean };
        time_tracking?: { enabled: boolean };
        tags?: { enabled: boolean };
        time_estimates?: { enabled: boolean };
        checklists?: { enabled: boolean };
        custom_fields?: { enabled: boolean };
        remap_dependencies?: { enabled: boolean };
        dependency_warning?: { enabled: boolean };
        portfolios?: { enabled: boolean };
      };
    },
  ): Promise<Space> {
    return await this.http.post<Space>(`/team/${workspaceId}/space`, data);
  }

  /**
   * Create a folder
   *
   * @param spaceId Space ID
   * @param data Folder creation data
   * @returns Created folder
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/createfolder
   * @example See examples/04-folders.ts
   */
  async createFolder(spaceId: string, data: { name: string }): Promise<Folder> {
    return await this.http.post<Folder>(`/space/${spaceId}/folder`, data);
  }

  /**
   * Create a list
   *
   * @param folderId Folder ID
   * @param data List creation data
   * @returns Created list
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/createlist
   * @example See examples/05-lists.ts
   */
  async createList(
    folderId: string,
    data: {
      name: string;
      content?: string;
      due_date?: number;
      due_date_time?: boolean;
      priority?: number;
      assignee?: number;
      status?: string;
    },
  ): Promise<List> {
    return await this.http.post<List>(`/folder/${folderId}/list`, data);
  }

  /**
   * Create a folderless list
   *
   * @param spaceId Space ID
   * @param data List creation data
   * @returns Created list
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/createfolderlesslist
   */
  async createFolderlessList(
    spaceId: string,
    data: {
      name: string;
      content?: string;
      due_date?: number;
      due_date_time?: boolean;
      priority?: number;
      assignee?: number;
      status?: string;
    },
  ): Promise<List> {
    return await this.http.post<List>(`/space/${spaceId}/list`, data);
  }

  /**
   * Get accessible custom fields for a list
   *
   * @param listId List ID
   * @returns Array of custom fields
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/getcustomfields
   * @example See examples/13-custom-fields.ts
   */
  async getCustomFields(listId: string): Promise<CustomField[]> {
    const response = await this.http.get<{ fields: CustomField[] }>(`/list/${listId}/field`);
    return response.fields;
  }

  /**
   * Set a custom field value on a task
   *
   * @param taskId Task ID
   * @param fieldId Custom field ID
   * @param value Field value
   * @returns Updated task or confirmation
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/setcustomfieldvalue
   * @example See examples/13-custom-fields.ts
   */
  async setCustomFieldValue(
    taskId: string,
    fieldId: string,
    value: string | number | boolean | { add?: number[]; rem?: number[] },
  ): Promise<void> {
    await this.http.post(`/task/${taskId}/field/${fieldId}`, { value });
  }

  /**
   * Create a webhook
   *
   * @param workspaceId Workspace ID
   * @param data Webhook creation data
   * @returns Created webhook
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/createwebhook
   * @example See examples/16-webhook-crud.ts
   */
  async createWebhook(
    workspaceId: string,
    data: {
      endpoint: string;
      events: WebhookEvent[];
      space_id?: string;
      folder_id?: string;
      list_id?: string;
      task_id?: string;
    },
  ): Promise<Webhook> {
    return await this.http.post<Webhook>(`/team/${workspaceId}/webhook`, data);
  }

  /**
   * Get all webhooks for a workspace
   *
   * @param workspaceId Workspace ID
   * @returns Array of webhooks
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/getwebhooks
   * @example See examples/16-webhook-crud.ts
   */
  async getWebhooks(workspaceId: string): Promise<Webhook[]> {
    const response = await this.http.get<{ webhooks: Webhook[] }>(`/team/${workspaceId}/webhook`);
    return response.webhooks;
  }

  /**
   * Update a webhook
   *
   * @param webhookId Webhook ID
   * @param data Webhook update data
   * @returns Updated webhook
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/updatewebhook
   * @example See examples/16-webhook-crud.ts
   */
  async updateWebhook(
    webhookId: string,
    data: {
      endpoint?: string;
      events?: WebhookEvent[];
      status?: 'active' | 'disabled';
    },
  ): Promise<Webhook> {
    return await this.http.put<Webhook>(`/webhook/${webhookId}`, data);
  }

  /**
   * Delete a webhook
   *
   * @param webhookId Webhook ID
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/deletewebhook
   * @example See examples/16-webhook-crud.ts
   */
  async deleteWebhook(webhookId: string): Promise<void> {
    await this.http.delete(`/webhook/${webhookId}`);
  }

  /**
   * Get comments on a task
   *
   * @param taskId Task ID
   * @returns Array of comments
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/gettaskcomments
   * @example See examples/18-comments.ts
   */
  async getComments(taskId: string): Promise<Comment[]> {
    const response = await this.http.get<{ comments: Comment[] }>(`/task/${taskId}/comment`);
    return response.comments;
  }

  /**
   * Create a comment on a task
   *
   * @param taskId Task ID
   * @param data Comment data
   * @returns Created comment
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/createtaskcomment
   * @example See examples/18-comments.ts
   */
  async createComment(
    taskId: string,
    data: {
      comment_text: string;
      assignee?: number;
      notify_all?: boolean;
    },
  ): Promise<Comment> {
    return await this.http.post<Comment>(`/task/${taskId}/comment`, data);
  }

  /**
   * Create a time entry
   *
   * @param workspaceId Workspace ID
   * @param data Time entry data
   * @returns Created time entry
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/createtimeentry
   * @example See examples/19-time-tracking.ts
   */
  async createTimeEntry(
    workspaceId: string,
    data: {
      description: string;
      start: number;
      duration: number;
      assignee?: number;
      billable?: boolean;
      tid?: string;
    },
  ): Promise<TimeEntry> {
    return await this.http.post<{ data: TimeEntry }>(`/team/${workspaceId}/time_entries`, data).then(
      (res) => res.data,
    );
  }

  /**
   * Get time entries for a workspace
   *
   * @param workspaceId Workspace ID
   * @param params Query parameters
   * @returns Array of time entries
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/gettimeentries
   * @example See examples/19-time-tracking.ts
   */
  async getTimeEntries(
    workspaceId: string,
    params?: {
      start_date?: number;
      end_date?: number;
      assignee?: number;
      include_task_tags?: boolean;
      include_location_names?: boolean;
      space_id?: string;
      folder_id?: string;
      list_id?: string;
      task_id?: string;
    },
  ): Promise<TimeEntry[]> {
    const response = await this.http.get<{ data: TimeEntry[] }>(
      `/team/${workspaceId}/time_entries`,
      { params },
    );
    return response.data;
  }

  /**
   * Get goals for a workspace
   *
   * @param workspaceId Workspace ID
   * @returns Array of goals
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/getgoals
   * @example See examples/20-goals.ts
   */
  async getGoals(workspaceId: string): Promise<Goal[]> {
    const response = await this.http.get<{ goals: Goal[] }>(`/team/${workspaceId}/goal`);
    return response.goals;
  }

  /**
   * Create a goal
   *
   * @param workspaceId Workspace ID
   * @param data Goal creation data
   * @returns Created goal
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/creategoal
   * @example See examples/20-goals.ts
   */
  async createGoal(
    workspaceId: string,
    data: {
      name: string;
      due_date?: number;
      description?: string;
      multiple_owners?: boolean;
      owners?: number[];
      color?: string;
    },
  ): Promise<Goal> {
    return await this.http.post<{ goal: Goal }>(`/team/${workspaceId}/goal`, data).then((res) => res.goal);
  }

  /**
   * Get views for a workspace
   *
   * @param workspaceId Workspace ID
   * @returns Array of views
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/getteamviews
   * @example See examples/21-views.ts
   */
  async getViews(workspaceId: string): Promise<View[]> {
    const response = await this.http.get<{ views: View[] }>(`/team/${workspaceId}/view`);
    return response.views;
  }

  /**
   * Get views for a space
   *
   * @param spaceId Space ID
   * @returns Array of views
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/getspaceviews
   * @example See examples/21-views.ts
   */
  async getSpaceViews(spaceId: string): Promise<View[]> {
    const response = await this.http.get<{ views: View[] }>(`/space/${spaceId}/view`);
    return response.views;
  }

  /**
   * Get views for a list
   *
   * @param listId List ID
   * @returns Array of views
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/getlistviews
   * @example See examples/21-views.ts
   */
  async getListViews(listId: string): Promise<View[]> {
    const response = await this.http.get<{ views: View[] }>(`/list/${listId}/view`);
    return response.views;
  }

  /**
   * Get members of a workspace
   *
   * @param workspaceId Workspace ID
   * @returns Array of members
   * @throws {ClickUpAPIError} If API request fails
   * @see https://developer.clickup.com/reference/getteammembers
   * @example See examples/22-members.ts
   */
  async getWorkspaceMembers(workspaceId: string): Promise<Member[]> {
    const response = await this.http.get<{ members: Member[] }>(`/team/${workspaceId}/member`);
    return response.members;
  }
}

export * from './types/index.js';
