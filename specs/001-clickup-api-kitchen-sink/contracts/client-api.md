# Client API Contract

**Date**: 2026-10-22

## Overview

This document defines the public interface contract for the ClickUp API v2 client library. This contract represents what users (developers and AI agents) interact with when using the reference implementation.

---

## Client Initialization

### Constructor

```typescript
class ClickUpClient {
  constructor(apiToken: string, options?: ClientOptions);
}

interface ClientOptions {
  baseURL?: string;           // Default: 'https://api.clickup.com/api/v2'
  timeout?: number;           // Default: 30000 (30 seconds)
  maxRetries?: number;        // Default: 5
  debug?: boolean;            // Default: false (or from DEBUG env var)
}
```

**Contract**:
- `apiToken` MUST be a valid ClickUp API token
- Client MUST validate token format (non-empty string)
- Client MUST apply authorization header to all requests: `Authorization: ${apiToken}`
- Client MUST respect timeout value (FR-021)
- Client MUST implement retry logic up to maxRetries (FR-017)
- Debug logging MUST redact API token (FR-022)

**Usage Example**:
```typescript
const client = new ClickUpClient(process.env.CLICKUP_API_TOKEN!);
```

---

## Authentication & User Operations

### Get Authenticated User

```typescript
async getUser(): Promise<User>
```

**API Endpoint**: `GET /user`

**Contract**:
- Returns current user information
- Throws `ClickUpAPIError` if token is invalid (401)
- Example: [examples/01-auth-user.ts](../../examples/01-auth-user.ts)
- Docs: https://developer.clickup.com/reference/getauthorizeduser

---

## Workspace Operations

### List Workspaces

```typescript
async getWorkspaces(): Promise<Workspace[]>
```

**API Endpoint**: `GET /team`

**Contract**:
- Returns all workspaces accessible to authenticated user
- Example: [examples/02-workspaces.ts](../../examples/02-workspaces.ts)
- Docs: https://developer.clickup.com/reference/getauthorizedteams

---

## Space Operations

### List Spaces

```typescript
async getSpaces(workspaceId: string): Promise<Space[]>
```

**API Endpoint**: `GET /team/{team_id}/space`

**Contract**:
- `workspaceId` MUST be valid workspace ID
- Returns all spaces in workspace
- Example: [examples/03-spaces.ts](../../examples/03-spaces.ts)
- Docs: https://developer.clickup.com/reference/getspaces

### Get Space

```typescript
async getSpace(spaceId: string): Promise<Space>
```

**API Endpoint**: `GET /space/{space_id}`

**Contract**:
- `spaceId` MUST be valid space ID
- Throws 404 if space doesn't exist
- Docs: https://developer.clickup.com/reference/getspace

### Create Space

```typescript
async createSpace(workspaceId: string, data: CreateSpaceData): Promise<Space>

interface CreateSpaceData {
  name: string;
  multiple_assignees?: boolean;
  features?: Partial<SpaceFeatures>;
}
```

**API Endpoint**: `POST /team/{team_id}/space`

**Contract**:
- `name` is required, non-empty
- Returns created space with generated ID
- Docs: https://developer.clickup.com/reference/createspace

---

## Folder Operations

### List Folders

```typescript
async getFolders(spaceId: string): Promise<Folder[]>
```

**API Endpoint**: `GET /space/{space_id}/folder`

**Contract**:
- Returns all folders in space
- Example: [examples/04-folders.ts](../../examples/04-folders.ts)
- Docs: https://developer.clickup.com/reference/getfolders

---

## List Operations

### Get Lists (in Folder)

```typescript
async getLists(folderId: string): Promise<List[]>
```

**API Endpoint**: `GET /folder/{folder_id}/list`

**Contract**:
- Returns all lists in folder
- Example: [examples/05-lists.ts](../../examples/05-lists.ts)
- Docs: https://developer.clickup.com/reference/getlists

### Get Folderless Lists

```typescript
async getFolderlessLists(spaceId: string): Promise<List[]>
```

**API Endpoint**: `GET /space/{space_id}/list`

**Contract**:
- Returns lists not in any folder
- Docs: https://developer.clickup.com/reference/getfolderlesslists

---

## Task Operations

### Get Task

```typescript
async getTask(taskId: string, options?: GetTaskOptions): Promise<Task>

interface GetTaskOptions {
  custom_task_ids?: boolean;
  team_id?: string;
  include_subtasks?: boolean;
}
```

**API Endpoint**: `GET /task/{task_id}`

**Contract**:
- Returns task by ID
- Throws 404 if task doesn't exist
- Example: [examples/06-task-crud.ts](../../examples/06-task-crud.ts)
- Docs: https://developer.clickup.com/reference/gettask

### Create Task

```typescript
async createTask(listId: string, data: CreateTaskData): Promise<Task>

interface CreateTaskData {
  name: string;
  description?: string;
  assignees?: number[];
  tags?: string[];
  status?: string;
  priority?: number;
  due_date?: number;         // Unix timestamp (ms)
  due_date_time?: boolean;
  time_estimate?: number;    // Milliseconds
  start_date?: number;       // Unix timestamp (ms)
  start_date_time?: boolean;
  notify_all?: boolean;
  parent?: string;           // Parent task ID for subtasks
  links_to?: string;
  custom_fields?: Array<{
    id: string;
    value: any;
  }>;
}
```

**API Endpoint**: `POST /list/{list_id}/task`

**Contract**:
- `name` is required
- Returns created task with generated ID
- `custom_fields` values must match field type (see CustomField in data-model.md)
- Example: [examples/06-task-crud.ts](../../examples/06-task-crud.ts), [examples/13-custom-fields.ts](../../examples/13-custom-fields.ts)
- Docs: https://developer.clickup.com/reference/createtask

### Update Task

```typescript
async updateTask(taskId: string, data: UpdateTaskData): Promise<Task>

interface UpdateTaskData {
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
}
```

**API Endpoint**: `PUT /task/{task_id}`

**Contract**:
- All fields optional (partial update)
- Returns updated task
- Example: [examples/06-task-crud.ts](../../examples/06-task-crud.ts)
- Docs: https://developer.clickup.com/reference/updatetask

### Delete Task

```typescript
async deleteTask(taskId: string): Promise<void>
```

**API Endpoint**: `DELETE /task/{task_id}`

**Contract**:
- Deletes task permanently
- Throws 404 if task doesn't exist
- Example: [examples/06-task-crud.ts](../../examples/06-task-crud.ts)
- Docs: https://developer.clickup.com/reference/deletetask

### Get Tasks (with pagination)

```typescript
async getTasks(listId: string, options?: GetTasksOptions): Promise<Task[]>
async* paginateTasks(listId: string, options?: GetTasksOptions): AsyncGenerator<Task[], void, undefined>

interface GetTasksOptions {
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
}
```

**API Endpoint**: `GET /list/{list_id}/task`

**Contract**:
- `getTasks()` returns single page (default 100 tasks)
- `paginateTasks()` is async generator that fetches all pages automatically (FR-006)
- Example: [examples/24-pagination.ts](../../examples/24-pagination.ts)
- Docs: https://developer.clickup.com/reference/gettasks

---

## Subtask Operations

Subtasks use the same `createTask()` method with `parent` field set.

**Contract**:
- Set `parent: parentTaskId` in CreateTaskData
- Example: [examples/07-subtasks.ts](../../examples/07-subtasks.ts)

---

## Dependency Operations

### Add Dependency

```typescript
async addDependency(taskId: string, dependsOn: string, dependencyOf?: string): Promise<Dependency>
```

**API Endpoint**: `POST /task/{task_id}/dependency`

**Contract**:
- Creates "waiting on" relationship: taskId waits for dependsOn to complete
- Example: [examples/08-dependencies.ts](../../examples/08-dependencies.ts)
- Docs: https://developer.clickup.com/reference/adddependency

### Delete Dependency

```typescript
async deleteDependency(taskId: string, dependsOn: string, dependencyOf?: string): Promise<void>
```

**API Endpoint**: `DELETE /task/{task_id}/dependency`

**Contract**:
- Removes dependency relationship
- Docs: https://developer.clickup.com/reference/deletedependency

---

## Checklist Operations

### Create Checklist

```typescript
async createChecklist(taskId: string, data: CreateChecklistData): Promise<Checklist>

interface CreateChecklistData {
  name: string;
}
```

**API Endpoint**: `POST /task/{task_id}/checklist`

**Contract**:
- Creates empty checklist attached to task
- Example: [examples/09-checklists.ts](../../examples/09-checklists.ts)
- Docs: https://developer.clickup.com/reference/createchecklist

### Create Checklist Item

```typescript
async createChecklistItem(checklistId: string, data: CreateChecklistItemData): Promise<ChecklistItem>

interface CreateChecklistItemData {
  name: string;
  assignee?: number;
}
```

**API Endpoint**: `POST /checklist/{checklist_id}/checklist_item`

**Contract**:
- Adds item to existing checklist
- Example: [examples/09-checklists.ts](../../examples/09-checklists.ts)
- Docs: https://developer.clickup.com/reference/createchecklistitem

---

## Tag Operations

### Add Tag to Task

```typescript
async addTag(taskId: string, tagName: string): Promise<void>
```

**API Endpoint**: `POST /task/{task_id}/tag/{tag_name}`

**Contract**:
- Adds tag to task (creates tag if doesn't exist)
- Example: [examples/10-tags.ts](../../examples/10-tags.ts)
- Docs: https://developer.clickup.com/reference/addtagtotask

### Remove Tag from Task

```typescript
async removeTag(taskId: string, tagName: string): Promise<void>
```

**API Endpoint**: `DELETE /task/{task_id}/tag/{tag_name}`

**Contract**:
- Removes tag from task
- Docs: https://developer.clickup.com/reference/removetagfromtask

---

## Comment Operations

### Get Comments

```typescript
async getComments(taskId: string): Promise<Comment[]>
```

**API Endpoint**: `GET /task/{task_id}/comment`

**Contract**:
- Returns all comments on task
- Example: [examples/14-comments.ts](../../examples/14-comments.ts)
- Docs: https://developer.clickup.com/reference/gettaskcomments

### Create Comment

```typescript
async createComment(taskId: string, data: CreateCommentData): Promise<Comment>

interface CreateCommentData {
  comment_text: string;
  assignee?: number;
  notify_all?: boolean;
}
```

**API Endpoint**: `POST /task/{task_id}/comment`

**Contract**:
- `comment_text` is required
- Example: [examples/14-comments.ts](../../examples/14-comments.ts)
- Docs: https://developer.clickup.com/reference/createtaskcomment

---

## Time Tracking Operations

### Create Time Entry

```typescript
async createTimeEntry(workspaceId: string, data: CreateTimeEntryData): Promise<TimeEntry>

interface CreateTimeEntryData {
  tid?: string;           // Task ID (optional)
  start: number;          // Unix timestamp (ms)
  end?: number;           // Unix timestamp (ms)
  duration: number;       // Milliseconds
  description?: string;
  billable?: boolean;
}
```

**API Endpoint**: `POST /team/{team_id}/time_entries`

**Contract**:
- `start` and `duration` required
- Example: [examples/15-time-tracking.ts](../../examples/15-time-tracking.ts)
- Docs: https://developer.clickup.com/reference/createtimeentry

---

## Custom Field Operations

### Get Custom Fields

```typescript
async getCustomFields(listId: string): Promise<CustomField[]>
```

**API Endpoint**: `GET /list/{list_id}/field`

**Contract**:
- Returns all custom field definitions for list
- Example: [examples/13-custom-fields.ts](../../examples/13-custom-fields.ts)
- Docs: https://developer.clickup.com/reference/getaccessiblecustomfields

### Set Custom Field Value

```typescript
async setCustomFieldValue(taskId: string, fieldId: string, value: any): Promise<void>
```

**API Endpoint**: `POST /task/{task_id}/field/{field_id}`

**Contract**:
- `value` type must match field type (text, number, dropdown option ID, etc.)
- Example: [examples/13-custom-fields.ts](../../examples/13-custom-fields.ts)
- Docs: https://developer.clickup.com/reference/setcustomfieldvalue

---

## Webhook Operations

### Create Webhook

```typescript
async createWebhook(workspaceId: string, data: CreateWebhookData): Promise<Webhook>

interface CreateWebhookData {
  endpoint: string;           // HTTPS URL
  events: WebhookEvent[];
  space_id?: string;
  folder_id?: string;
  list_id?: string;
  task_id?: string;
}
```

**API Endpoint**: `POST /team/{team_id}/webhook`

**Contract**:
- `endpoint` must be HTTPS URL
- `events` must contain at least one event type
- Returns webhook with generated `secret` for signature verification
- Example: [examples/16-webhooks-create.ts](../../examples/16-webhooks-create.ts)
- Docs: https://developer.clickup.com/reference/createwebhook

### Get Webhooks

```typescript
async getWebhooks(workspaceId: string): Promise<Webhook[]>
```

**API Endpoint**: `GET /team/{team_id}/webhook`

**Contract**:
- Returns all webhooks registered for workspace
- Example: [examples/17-webhooks-list.ts](../../examples/17-webhooks-list.ts)
- Docs: https://developer.clickup.com/reference/getwebhooks

### Delete Webhook

```typescript
async deleteWebhook(webhookId: string): Promise<void>
```

**API Endpoint**: `DELETE /webhook/{webhook_id}`

**Contract**:
- Permanently removes webhook
- Example: [examples/18-webhooks-delete.ts](../../examples/18-webhooks-delete.ts)
- Docs: https://developer.clickup.com/reference/deletewebhook

---

## Webhook Signature Verification

### Verify Webhook Signature

```typescript
function verifyWebhookSignature(
  payload: string,        // Raw HTTP body as string
  signature: string,      // X-Signature header value
  secret: string          // Webhook secret from creation response
): boolean
```

**Contract**:
- Implements HMAC-SHA256 verification (FR-007)
- Returns `true` if signature is valid, `false` otherwise
- MUST use timing-safe comparison to prevent timing attacks
- Example: [examples/19-signature-verify.ts](../../examples/19-signature-verify.ts)
- Docs: https://developer.clickup.com/docs/webhooks-signature-verification

**Usage Example**:
```typescript
import { verifyWebhookSignature } from './src/webhooks/signature-verification';

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-signature'] as string;
  const isValid = verifyWebhookSignature(
    JSON.stringify(req.body),
    signature,
    process.env.WEBHOOK_SECRET!
  );
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook event
  res.status(200).send('OK');
});
```

---

## Goal Operations

### Get Goals

```typescript
async getGoals(workspaceId: string): Promise<Goal[]>
```

**API Endpoint**: `GET /team/{team_id}/goal`

**Contract**:
- Returns all goals in workspace
- Example: [examples/20-goals.ts](../../examples/20-goals.ts)
- Docs: https://developer.clickup.com/reference/getgoals

---

## View Operations

### Get Views

```typescript
async getViews(workspaceId: string): Promise<View[]>
```

**API Endpoint**: `GET /team/{team_id}/view`

**Contract**:
- Returns all views in workspace
- Example: [examples/21-views.ts](../../examples/21-views.ts)
- Docs: https://developer.clickup.com/reference/getviews

---

## Error Handling Contract

All methods MUST throw `ClickUpAPIError` for API errors:

```typescript
class ClickUpAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode?: string,
    public response?: any
  );
}
```

**Error Scenarios**:

| HTTP Status | Meaning | Behavior |
|-------------|---------|----------|
| 401 | Unauthorized | Throw immediately (invalid token) |
| 403 | Forbidden | Throw immediately (insufficient permissions) |
| 404 | Not Found | Throw immediately (resource doesn't exist) |
| 429 | Rate Limited | Retry up to 5 times with exponential backoff (FR-005, FR-017) |
| 500 | Server Error | Throw immediately (ClickUp API error) |
| Timeout | Network timeout | Throw after 30 seconds (FR-021) |

---

## Rate Limiting Contract

The client MUST automatically handle rate limiting (FR-005):

1. Detect HTTP 429 response
2. Read `Retry-After` header (seconds)
3. Wait for duration specified (or use exponential backoff if header missing)
4. Retry request
5. Repeat up to 5 attempts (FR-017)
6. Throw `ClickUpAPIError` if all retries exhausted

Example: [examples/23-rate-limiting.ts](../../examples/23-rate-limiting.ts)

---

## Debug Logging Contract

When debug logging is enabled (FR-022):

1. Enable via `DEBUG=clickup:*` environment variable
2. Log namespaces: `clickup:http`, `clickup:retry`, `clickup:pagination`
3. MUST automatically redact API tokens in logs
4. Redaction rules:
   - `Authorization` header → `Authorization: [REDACTED]`
   - Any key containing "token", "secret", "password", "key" → value replaced with `[REDACTED]`

**Usage**:
```bash
DEBUG=clickup:* node examples/01-auth-user.ts
```

---

## Type Safety Contract

All methods MUST:
- Accept strongly-typed parameters (TypeScript interfaces)
- Return strongly-typed results matching data-model.md definitions
- Include JSDoc comments with:
  - Parameter descriptions
  - Return type description
  - Link to ClickUp API documentation
  - Link to example file

**Example JSDoc**:
```typescript
/**
 * Get information about the authenticated user.
 * 
 * @returns User information including id, username, email, and settings
 * @throws {ClickUpAPIError} If API token is invalid or API request fails
 * 
 * @see https://developer.clickup.com/reference/getauthorizeduser
 * @example See examples/01-auth-user.ts
 */
async getUser(): Promise<User>
```

---

## Summary

This contract defines:
- ✅ Client initialization and configuration
- ✅ All major API operations (auth, workspaces, spaces, folders, lists, tasks, webhooks, etc.)
- ✅ Error handling behavior (401/403/404 throw, 429 retry)
- ✅ Rate limiting strategy (5 retries with exponential backoff)
- ✅ Pagination support (async generators)
- ✅ Webhook signature verification
- ✅ Debug logging with token redaction
- ✅ Type safety requirements (JSDoc + TypeScript)

All contracts map to functional requirements (FR-001 through FR-022) and success criteria (SC-001 through SC-012) from the specification.
