# Data Model: ClickUp API v2 Resources

**Date**: 2026-10-22

## Overview

This document defines the TypeScript type definitions for ClickUp API v2 resources based on official documentation. These types model API responses and are used throughout the client library and examples.

**Source**: [ClickUp API v2 Reference](https://developer.clickup.com/reference/)

---

## Core Entity Relationships

```
User (authenticated)
  └── authorizes access to Workspaces (Teams)
       └── contain Spaces
            └── contain Folders (optional)
                 └── contain Lists
                      └── contain Tasks
                           ├── have Subtasks (parent-child relationship via parent_id)
                           ├── have Dependencies (depends_on, dependency_of)
                           ├── have Checklists
                           ├── have Comments
                           ├── have Attachments
                           ├── have TimeEntries
                           ├── have CustomField values
                           └── have Tags, Assignees (Members)

Workspace
  ├── has Members
  ├── has Goals
  └── has Webhooks (registered for events)

List
  ├── has CustomField definitions
  └── has Views (saved configurations)
```

---

## Entity Definitions

### User

Represents the authenticated ClickUp user.

**API Endpoint**: `GET https://api.clickup.com/api/v2/user`

**TypeScript Definition**:
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  color: string;                    // Hex color for user avatar
  profilePicture: string | null;    // URL to profile image
  initials: string;
  week_start_day: number;           // 0 = Sunday, 1 = Monday, etc.
  global_font_support: boolean;
  timezone: string;                 // e.g., "America/New_York"
}
```

**Validation Rules**:
- `id` is unique identifier (immutable)
- `email` must be valid email format
- `color` is hex string (e.g., "#FF5733")

---

### Workspace (Team)

Top-level organizational container. ClickUp API calls these "teams" but UI displays as "workspaces".

**API Endpoint**: `GET https://api.clickup.com/api/v2/team`

**TypeScript Definition**:
```typescript
interface Workspace {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  members: Member[];
}

interface Member {
  user: {
    id: number;
    username: string;
    email: string;
    color: string;
    profilePicture: string | null;
    initials: string;
  };
  invited_by?: {
    id: number;
    username: string;
    email: string;
  };
}
```

**Relationships**:
- Workspace → many Spaces
- Workspace → many Members
- Workspace → many Goals
- Workspace → many Webhooks

---

### Space

Organizational unit within a workspace. Spaces group related projects.

**API Endpoint**: `GET https://api.clickup.com/api/v2/team/{team_id}/space`

**TypeScript Definition**:
```typescript
interface Space {
  id: string;
  name: string;
  color: string | null;
  private: boolean;
  avatar: string | null;
  admin_can_manage: boolean;
  statuses: Status[];
  multiple_assignees: boolean;
  features: SpaceFeatures;
}

interface Status {
  id: string;
  status: string;           // Display name
  type: 'open' | 'closed' | 'custom';
  orderindex: number;
  color: string;
}

interface SpaceFeatures {
  due_dates: { enabled: boolean; start_date: boolean; remap_due_dates: boolean; remap_closed_due_date: boolean };
  sprints: { enabled: boolean };
  time_tracking: { enabled: boolean };
  points: { enabled: boolean };
  custom_fields: { enabled: boolean };
  checklists: { enabled: boolean };
  zoom: { enabled: boolean };
  milestones: { enabled: boolean };
  // ... additional features
}
```

**Relationships**:
- Space → many Folders
- Space → many Lists (can be folderless)
- Space belongs to one Workspace

---

### Folder

Optional grouping within a space. Folders organize lists but are not required.

**API Endpoint**: `GET https://api.clickup.com/api/v2/space/{space_id}/folder`

**TypeScript Definition**:
```typescript
interface Folder {
  id: string;
  name: string;
  orderindex: number;
  override_statuses: boolean;
  hidden: boolean;
  space: {
    id: string;
    name: string;
  };
  task_count: string;       // Note: API returns as string
  lists: List[];
}
```

**Relationships**:
- Folder → many Lists
- Folder belongs to one Space

---

### List

Container for tasks. Every task belongs to exactly one list.

**API Endpoint**: `GET https://api.clickup.com/api/v2/folder/{folder_id}/list`

**TypeScript Definition**:
```typescript
interface List {
  id: string;
  name: string;
  orderindex: number;
  content: string;          // Description
  status: Status | null;
  priority: Priority | null;
  assignee: User | null;
  task_count: number;
  due_date: string | null;  // Unix timestamp (ms) as string
  start_date: string | null;
  folder: {
    id: string;
    name: string;
    hidden: boolean;
  };
  space: {
    id: string;
    name: string;
  };
  archived: boolean;
  override_statuses: boolean;
  statuses: Status[];
  permission_level: string;
}

interface Priority {
  id: string;
  priority: string;         // "urgent", "high", "normal", "low"
  color: string;
  orderindex: string;
}
```

**Relationships**:
- List → many Tasks
- List → many CustomField definitions
- List → many Views
- List belongs to one Folder (or Space if folderless)

---

### Task

Core work item. Tasks can have subtasks (parent_id relationship).

**API Endpoint**: `GET https://api.clickup.com/api/v2/task/{task_id}`

**TypeScript Definition**:
```typescript
interface Task {
  id: string;
  custom_id: string | null;     // User-defined custom task ID
  name: string;
  text_content: string;          // Plain text description
  description: string;           // Markdown description
  status: Status;
  orderindex: string;
  date_created: string;          // Unix timestamp (ms)
  date_updated: string;
  date_closed: string | null;
  creator: User;
  assignees: User[];
  watchers: User[];
  checklists: Checklist[];
  tags: Tag[];
  parent: string | null;         // Parent task ID for subtasks
  priority: Priority | null;
  due_date: string | null;       // Unix timestamp (ms)
  start_date: string | null;
  points: number | null;
  time_estimate: number | null;  // Milliseconds
  custom_fields: CustomFieldValue[];
  dependencies: Dependency[];
  linked_tasks: LinkedTask[];
  team_id: string;
  url: string;                   // Web URL to task
  permission_level: string;
  list: {
    id: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  };
  folder: {
    id: string;
    name: string;
  };
  space: {
    id: string;
  };
}

interface Tag {
  name: string;
  tag_fg: string;           // Foreground color
  tag_bg: string;           // Background color
  creator: number;          // User ID
}

interface LinkedTask {
  task_id: string;
  link_id: string;
  date_created: string;
  userid: string;
}
```

**Relationships**:
- Task → many Subtasks (via parent_id)
- Task → many Dependencies
- Task → many Checklists
- Task → many Comments
- Task → many Attachments
- Task → many TimeEntries
- Task → many CustomFieldValues
- Task → many Assignees (Members)
- Task belongs to one List

**Validation Rules**:
- `name` required (non-empty)
- `status` must match list's available statuses
- `priority` must be one of: urgent, high, normal, low, or null
- `due_date` if present must be Unix timestamp in milliseconds
- `parent` if present must reference valid task ID

**State Transitions**:
Tasks move through statuses defined by their list. Typical flow:
1. Open (to do, backlog)
2. In Progress (active work)
3. Review (awaiting approval)
4. Closed (complete, done)

---

### Subtask

Subtasks are Tasks with a `parent` field set. No separate entity type.

**Relationship**: `parent: string` field on Task references parent task ID.

---

### Dependency

Represents task relationships (blocks/blocked-by).

**API Endpoint**: `POST https://api.clickup.com/api/v2/task/{task_id}/dependency`

**TypeScript Definition**:
```typescript
interface Dependency {
  task_id: string;          // The dependent task
  depends_on: string;       // Task it depends on
  type: 'waiting_on' | 'blocking';
  date_created: string;
  userid: string;
}
```

**Validation Rules**:
- Cannot create circular dependencies
- `task_id` and `depends_on` must reference valid tasks

---

### Checklist

Subtask checklist within a task.

**API Endpoint**: `POST https://api.clickup.com/api/v2/task/{task_id}/checklist`

**TypeScript Definition**:
```typescript
interface Checklist {
  id: string;
  task_id: string;
  name: string;
  orderindex: number;
  resolved: number;         // Count of completed items
  unresolved: number;       // Count of incomplete items
  items: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  name: string;
  orderindex: number;
  assignee: User | null;
  resolved: boolean;
  parent: string | null;    // Checklist ID
  date_created: string;
  children: ChecklistItem[];
}
```

**Relationships**:
- Checklist belongs to one Task
- Checklist → many ChecklistItems (can be nested)

---

### CustomField

Configurable field definition at list level. Tasks store values referencing these definitions.

**API Endpoint**: `GET https://api.clickup.com/api/v2/list/{list_id}/field`

**TypeScript Definition**:
```typescript
interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'drop_down' | 'checkbox' | 'url' | 'email' | 'phone' | 'labels' | 'users' | 'location' | 'rating';
  type_config: CustomFieldTypeConfig;
  date_created: string;
  hide_from_guests: boolean;
  required: boolean;
}

interface CustomFieldTypeConfig {
  // Type-specific configuration
  default?: number;                    // For number, currency, rating
  placeholder?: string;                // For text, url, email, phone
  options?: CustomFieldOption[];       // For drop_down, labels
  new_drop_down?: boolean;             // For drop_down (allows adding options)
}

interface CustomFieldOption {
  id: string;
  name: string;
  color: string | null;
  orderindex: number;
}

interface CustomFieldValue {
  id: string;               // CustomField ID
  name: string;
  type: string;
  type_config: CustomFieldTypeConfig;
  date_created: string;
  hide_from_guests: boolean;
  value: string | number | boolean | CustomFieldOption | null;  // Type varies
}
```

**Validation Rules**:
- `type` determines valid `value` format in CustomFieldValue
- `required` fields must have non-null value
- Drop-down values must reference valid option IDs

---

### Comment

Task discussion item.

**API Endpoint**: `GET https://api.clickup.com/api/v2/task/{task_id}/comment`

**TypeScript Definition**:
```typescript
interface Comment {
  id: string;
  comment: CommentContent[];
  comment_text: string;      // Plain text version
  user: User;
  date: string;              // Unix timestamp (ms)
  resolved: boolean;
  assignee: User | null;
  assigned_by: User | null;
  reactions: Reaction[];
}

interface CommentContent {
  text: string;
  type?: 'mention' | 'link';
  attributes?: {
    id?: string;            // Mentioned user ID
    url?: string;           // Link URL
  };
}

interface Reaction {
  reaction: string;         // Emoji
  user: User;
}
```

**Relationships**:
- Comment belongs to one Task
- Comment → one User (creator)

---

### Attachment

File uploaded to a task.

**API Endpoint**: `GET https://api.clickup.com/api/v2/task/{task_id}/attachment` (not documented, inferred)

**TypeScript Definition**:
```typescript
interface Attachment {
  id: string;
  version: number;
  date: string;             // Unix timestamp (ms)
  title: string;            // Filename
  extension: string;        // File extension
  thumbnail_small: string | null;
  thumbnail_medium: string | null;
  thumbnail_large: string | null;
  url: string;              // Download URL
  user: User;
  size: number;             // Bytes
}
```

**Relationships**:
- Attachment belongs to one Task
- Attachment → one User (uploader)

---

### TimeEntry

Time tracking record for a task.

**API Endpoint**: `GET https://api.clickup.com/api/v2/team/{team_id}/time_entries`

**TypeScript Definition**:
```typescript
interface TimeEntry {
  id: string;
  task: {
    id: string;
    name: string;
  } | null;
  wid: string;              // Workspace ID
  user: User;
  billable: boolean;
  start: string;            // Unix timestamp (ms)
  end: string | null;       // Unix timestamp (ms), null if running
  duration: string;         // Milliseconds as string
  description: string;
  tags: Tag[];
  at: string;               // Last updated timestamp
}
```

**Relationships**:
- TimeEntry optionally belongs to one Task
- TimeEntry → one User

**Validation Rules**:
- `start` required
- `end` must be after `start` if present
- `duration` calculated as `end - start`

---

### Webhook

Event notification endpoint configuration.

**API Endpoint**: `POST https://api.clickup.com/api/v2/team/{team_id}/webhook`

**TypeScript Definition**:
```typescript
interface Webhook {
  id: string;
  userid: number;
  team_id: string;
  endpoint: string;          // URL to POST events
  client_id: string;
  events: WebhookEvent[];
  task_id: string | null;    // Optional: filter to specific task
  list_id: string | null;    // Optional: filter to specific list
  folder_id: string | null;  // Optional: filter to specific folder
  space_id: string | null;   // Optional: filter to specific space
  health: {
    status: 'active' | 'failing';
    fail_count: number;
  };
  secret: string;            // For signature verification (HMAC-SHA256)
}

type WebhookEvent =
  | 'taskCreated'
  | 'taskUpdated'
  | 'taskDeleted'
  | 'taskPriorityUpdated'
  | 'taskStatusUpdated'
  | 'taskAssigneeUpdated'
  | 'taskDueDateUpdated'
  | 'taskTagUpdated'
  | 'taskMoved'
  | 'taskCommentPosted'
  | 'taskCommentUpdated'
  | 'taskTimeEstimateUpdated'
  | 'taskTimeTrackedUpdated'
  | 'listCreated'
  | 'listUpdated'
  | 'listDeleted'
  | 'folderCreated'
  | 'folderUpdated'
  | 'folderDeleted'
  | 'spaceCreated'
  | 'spaceUpdated'
  | 'spaceDeleted'
  | 'goalCreated'
  | 'goalUpdated'
  | 'goalDeleted';
```

**Relationships**:
- Webhook belongs to one Workspace
- Webhook optionally filtered to Task/List/Folder/Space

**Validation Rules**:
- `endpoint` must be valid HTTPS URL
- `events` array must contain at least one event type
- `secret` used for HMAC-SHA256 signature in `X-Signature` header

**Signature Verification**:
```typescript
// Webhook payload includes X-Signature header
// Verify: HMAC-SHA256(payload_body, secret) === X-Signature
```

---

### Goal

Objective tracking within a workspace.

**API Endpoint**: `GET https://api.clickup.com/api/v2/team/{team_id}/goal`

**TypeScript Definition**:
```typescript
interface Goal {
  id: string;
  name: string;
  team_id: string;
  date_created: string;     // Unix timestamp (ms)
  start_date: string | null;
  due_date: string | null;
  description: string;
  private: boolean;
  archived: boolean;
  creator: User;
  color: string;
  pretty_id: string;        // User-friendly ID (e.g., "GOAL-123")
  multiple_owners: boolean;
  folder_id: string | null;
  members: User[];
  owners: User[];
  key_results: KeyResult[];
}

interface KeyResult {
  id: string;
  goal_id: string;
  name: string;
  creator: User;
  type: 'number' | 'currency' | 'boolean' | 'percentage' | 'automatic';
  unit: string | null;
  steps_start: number;
  steps_end: number;
  steps_current: number;
  completed: boolean;
  task_ids: string[];
  list_ids: string[];
}
```

**Relationships**:
- Goal belongs to one Workspace
- Goal → many KeyResults
- Goal → many Owners (Members)

---

### View

Saved task view configuration (filters, grouping, sorting).

**API Endpoint**: `GET https://api.clickup.com/api/v2/team/{team_id}/view`

**TypeScript Definition**:
```typescript
interface View {
  id: string;
  name: string;
  type: 'list' | 'board' | 'calendar' | 'gantt' | 'timeline' | 'workload' | 'activity' | 'map' | 'table';
  parent: {
    id: string;
    type: 'team' | 'space' | 'folder' | 'list';
  };
  grouping: {
    field: string;
    dir: 1 | -1;
    collapsed: string[];
  };
  divide: {
    field: string | null;
    dir: 1 | -1 | null;
    collapsed: string[];
  } | null;
  sorting: {
    fields: Array<{
      field: string;
      dir: 1 | -1;
    }>;
  } | null;
  filters: {
    op: 'AND' | 'OR';
    fields: ViewFilter[];
  };
  columns: {
    fields: ViewColumn[];
  } | null;
  team_sidebar: {
    assignees: any[];
    assigned_comments: boolean;
    unassigned_tasks: boolean;
  };
  settings: {
    show_task_locations: boolean;
    show_subtasks: number;
    show_subtask_parent_names: boolean;
    show_closed_subtasks: boolean;
    show_assignees: boolean;
    show_images: boolean;
    collapse_empty_columns: boolean | null;
    me_comments: boolean;
    me_subtasks: boolean;
    me_checklists: boolean;
  };
}

interface ViewFilter {
  field: string;           // e.g., "assignees", "status", "priority"
  operator: '=' | '!=' | '<' | '>' | '<=' | '>=' | 'IS NULL' | 'IS NOT NULL' | 'RANGE';
  value: any;
  values?: any[];
}

interface ViewColumn {
  field: string;
  width: number;
  hidden: boolean;
}
```

**Relationships**:
- View belongs to Workspace/Space/Folder/List (via parent)

---

## Common Types

### Error Response

**TypeScript Definition**:
```typescript
interface ClickUpAPIError {
  err: string;              // Error message
  ECODE: string;            // Error code (e.g., "OAUTH_027")
}
```

**HTTP Status Codes**:
- `401 Unauthorized`: Invalid or missing API token
- `403 Forbidden`: Valid token but insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `429 Too Many Requests`: Rate limit exceeded (includes `Retry-After` header)
- `500 Internal Server Error`: ClickUp API error

---

## Type Organization Strategy

Types are organized by entity in `src/client/types/`:

- `common.ts`: Shared types (Status, Priority, User, Error)
- `user.ts`: User entity
- `workspace.ts`: Workspace (Team) and Member
- `space.ts`: Space and SpaceFeatures
- `folder.ts`: Folder
- `list.ts`: List
- `task.ts`: Task, Tag, LinkedTask, Dependency
- `custom-field.ts`: CustomField, CustomFieldValue, type configs
- `webhook.ts`: Webhook, WebhookEvent
- `comment.ts`: Comment, CommentContent, Reaction
- `time-entry.ts`: TimeEntry
- `goal.ts`: Goal, KeyResult
- `view.ts`: View, ViewFilter, ViewColumn

Each file exports interfaces with JSDoc comments linking to official ClickUp API documentation.
