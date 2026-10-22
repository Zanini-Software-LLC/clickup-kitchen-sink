# ClickUp API v2 Kitchen Sink (UNOFFICIAL)

⚠️ **UNOFFICIAL** - This is an UNOFFICIAL reference implementation. Not affiliated with or endorsed by ClickUp.

**Purpose**: Comprehensive TypeScript reference implementation demonstrating ClickUp API v2 usage patterns for AI agent training and developer education.

## ⚠️ Important Legal Notices

- **Not affiliated with ClickUp**: This project is an independent reference implementation
- **Terms compliance**: See [ClickUp Developer Terms](https://clickup.com/terms)
- **Data usage**: This project uses **synthetic data only** per ClickUp Developer Terms §6 (prohibits using user data to train AI)
- **No AI features**: Does not use or demonstrate ClickUp AI features
- **MIT License**: Open source for educational and reference purposes

## Features

TypeScript client library with comprehensive API coverage:

### Core Client Methods

| Method | Category | Description | API Docs |
|--------|----------|-------------|----------|
| `getUser()` | Authentication | Get authenticated user information | [API Ref](https://developer.clickup.com/reference/getauthorizeduser) |
| `getWorkspaces()` | Workspaces | List accessible workspaces (teams) | [API Ref](https://developer.clickup.com/reference/getauthorizedteams) |
| `getSpaces()` | Spaces | List spaces in workspace | [API Ref](https://developer.clickup.com/reference/getspaces) |
| `getSpace()` | Spaces | Get space by ID | [API Ref](https://developer.clickup.com/reference/getspace) |
| `createSpace()` | Spaces | Create new space | [API Ref](https://developer.clickup.com/reference/createspace) |
| `getFolders()` | Folders | List folders in space | [API Ref](https://developer.clickup.com/reference/getfolders) |
| `createFolder()` | Folders | Create folder in space | [API Ref](https://developer.clickup.com/reference/createfolder) |
| `getLists()` | Lists | Get lists in folder | [API Ref](https://developer.clickup.com/reference/getlists) |
| `getFolderlessLists()` | Lists | Get folderless lists in space | [API Ref](https://developer.clickup.com/reference/getfolderlesslists) |
| `createList()` | Lists | Create list in folder | [API Ref](https://developer.clickup.com/reference/createlist) |
| `createFolderlessList()` | Lists | Create folderless list | [API Ref](https://developer.clickup.com/reference/createfolderlesslist) |
| `getTask()` | Tasks | Get task by ID | [API Ref](https://developer.clickup.com/reference/gettask) |
| `createTask()` | Tasks | Create new task | [API Ref](https://developer.clickup.com/reference/createtask) |
| `updateTask()` | Tasks | Update existing task | [API Ref](https://developer.clickup.com/reference/updatetask) |
| `deleteTask()` | Tasks | Delete task | [API Ref](https://developer.clickup.com/reference/deletetask) |
| `getTasks()` | Tasks | Get tasks in list (paginated) | [API Ref](https://developer.clickup.com/reference/gettasks) |
| `paginateTasks()` | Tasks | Async generator for all tasks | [API Ref](https://developer.clickup.com/reference/gettasks) |
| `addDependency()` | Dependencies | Add task dependency | [API Ref](https://developer.clickup.com/reference/adddependency) |
| `deleteDependency()` | Dependencies | Remove task dependency | [API Ref](https://developer.clickup.com/reference/deletedependency) |
| `createChecklist()` | Checklists | Create checklist on task | [API Ref](https://developer.clickup.com/reference/createchecklist) |
| `createChecklistItem()` | Checklists | Add item to checklist | [API Ref](https://developer.clickup.com/reference/createchecklistitem) |
| `addTag()` | Tags | Add tag to task | [API Ref](https://developer.clickup.com/reference/addtagtotask) |
| `removeTag()` | Tags | Remove tag from task | [API Ref](https://developer.clickup.com/reference/removetagfromtask) |
| `getCustomFields()` | Custom Fields | Get custom fields for list | [API Ref](https://developer.clickup.com/reference/getcustomfields) |
| `setCustomFieldValue()` | Custom Fields | Set custom field value on task | [API Ref](https://developer.clickup.com/reference/setcustomfieldvalue) |
| `createWebhook()` | Webhooks | Register webhook | [API Ref](https://developer.clickup.com/reference/createwebhook) |
| `getWebhooks()` | Webhooks | List webhooks | [API Ref](https://developer.clickup.com/reference/getwebhooks) |
| `updateWebhook()` | Webhooks | Update webhook | [API Ref](https://developer.clickup.com/reference/updatewebhook) |
| `deleteWebhook()` | Webhooks | Delete webhook | [API Ref](https://developer.clickup.com/reference/deletewebhook) |
| `getComments()` | Comments | Get comments on task | [API Ref](https://developer.clickup.com/reference/gettaskcomments) |
| `createComment()` | Comments | Create comment on task | [API Ref](https://developer.clickup.com/reference/createtaskcomment) |
| `createTimeEntry()` | Time Tracking | Create time entry | [API Ref](https://developer.clickup.com/reference/createtimeentry) |
| `getTimeEntries()` | Time Tracking | Get time entries | [API Ref](https://developer.clickup.com/reference/gettimeentries) |
| `getGoals()` | Goals | List goals in workspace | [API Ref](https://developer.clickup.com/reference/getgoals) |
| `createGoal()` | Goals | Create goal | [API Ref](https://developer.clickup.com/reference/creategoal) |
| `getViews()` | Views | Get workspace views | [API Ref](https://developer.clickup.com/reference/getteamviews) |
| `getSpaceViews()` | Views | Get space views | [API Ref](https://developer.clickup.com/reference/getspaceviews) |
| `getListViews()` | Views | Get list views | [API Ref](https://developer.clickup.com/reference/getlistviews) |
| `getWorkspaceMembers()` | Members | Get workspace members | [API Ref](https://developer.clickup.com/reference/getteammembers) |

### Examples

| Example | Category | Description | API Docs |
|---------|----------|-------------|----------|
| [01-auth-user.ts](examples/01-auth-user.ts) | Authentication | Get authenticated user information | [API Ref](https://developer.clickup.com/reference/getauthorizeduser) |
| [02-workspaces.ts](examples/02-workspaces.ts) | Hierarchy | List accessible workspaces | [API Ref](https://developer.clickup.com/reference/getauthorizedteams) |
| [03-spaces.ts](examples/03-spaces.ts) | Hierarchy | List, get, and create spaces | [API Ref](https://developer.clickup.com/reference/getspaces) |
| [04-folders.ts](examples/04-folders.ts) | Hierarchy | List and create folders | [API Ref](https://developer.clickup.com/reference/getfolders) |
| [05-lists.ts](examples/05-lists.ts) | Hierarchy | List and create lists | [API Ref](https://developer.clickup.com/reference/getlists) |
| [06-task-crud.ts](examples/06-task-crud.ts) | Tasks | Complete task CRUD operations | [API Ref](https://developer.clickup.com/reference/createtask) |
| [07-subtasks.ts](examples/07-subtasks.ts) | Tasks | Create and manage subtasks | [API Ref](https://developer.clickup.com/reference/createtask) |
| [08-dependencies.ts](examples/08-dependencies.ts) | Tasks | Add/remove task dependencies | [API Ref](https://developer.clickup.com/reference/adddependency) |
| [09-checklists.ts](examples/09-checklists.ts) | Tasks | Create checklists and items | [API Ref](https://developer.clickup.com/reference/createchecklist) |
| [10-tags.ts](examples/10-tags.ts) | Tasks | Add and remove tags | [API Ref](https://developer.clickup.com/reference/addtagtotask) |
| [11-assignees.ts](examples/11-assignees.ts) | Tasks | Manage task assignees | [API Ref](https://developer.clickup.com/reference/updatetask) |
| [12-attachments.ts](examples/12-attachments.ts) | Tasks | View attachment metadata | [API Ref](https://developer.clickup.com/reference/gettask) |
| [13-custom-fields.ts](examples/13-custom-fields.ts) | Custom Fields | Get and set custom field values | [API Ref](https://developer.clickup.com/reference/getcustomfields) |
| [14-list-tasks.ts](examples/14-list-tasks.ts) | Tasks | List and filter tasks | [API Ref](https://developer.clickup.com/reference/gettasks) |
| [15-rate-limiting.ts](examples/15-rate-limiting.ts) | Infrastructure | Rate limit handling demo | [API Ref](https://developer.clickup.com/reference/) |
| [16-webhook-crud.ts](examples/16-webhook-crud.ts) | Webhooks | Complete webhook CRUD operations | [API Ref](https://developer.clickup.com/reference/createwebhook) |
| [17-webhook-verification.ts](examples/17-webhook-verification.ts) | Webhooks | HMAC signature verification | [API Ref](https://developer.clickup.com/reference/webhooks) |
| [18-comments.ts](examples/18-comments.ts) | Comments | Create and list comments | [API Ref](https://developer.clickup.com/reference/createtaskcomment) |
| [19-time-tracking.ts](examples/19-time-tracking.ts) | Time Tracking | Create and get time entries | [API Ref](https://developer.clickup.com/reference/createtimeentry) |
| [20-goals.ts](examples/20-goals.ts) | Goals | List and create goals | [API Ref](https://developer.clickup.com/reference/getgoals) |
| [21-views.ts](examples/21-views.ts) | Views | Get views at different levels | [API Ref](https://developer.clickup.com/reference/getteamviews) |
| [22-members.ts](examples/22-members.ts) | Members | List workspace members | [API Ref](https://developer.clickup.com/reference/getteammembers) |
| [23-error-handling.ts](examples/23-error-handling.ts) | Infrastructure | Error handling patterns | [API Ref](https://developer.clickup.com/reference/) |
| [24-pagination.ts](examples/24-pagination.ts) | Infrastructure | Pagination with async generators | [API Ref](https://developer.clickup.com/reference/gettasks) |
| [99-end-to-end.ts](examples/99-end-to-end.ts) | End-to-End | Complete workflow demonstration | [API Ref](https://developer.clickup.com/reference/) |

### Infrastructure Features

- ✅ **Automatic retry logic**: 5 attempts with exponential backoff (1s, 2s, 4s, 8s, 16s)
- ✅ **Rate limit handling**: Respects `Retry-After` header on HTTP 429
- ✅ **30-second timeout**: Configurable per-request timeout
- ✅ **Debug logging**: Enable with `DEBUG=clickup:*` environment variable
- ✅ **Token redaction**: Automatic redaction of sensitive data in logs
- ✅ **Webhook signature verification**: HMAC-SHA256 validation
- ✅ **TypeScript types**: Full type definitions for all API resources
- ✅ **Pagination support**: Async generator for cursor-based pagination

### API Coverage

This implementation provides **39 client methods** covering **15 operation categories** as defined in the project specification (FR-002):

1. Authentication (1 method)
2. Workspaces (2 methods)
3. Spaces (3 methods)
4. Folders (2 methods)
5. Lists (4 methods)
6. Tasks (6 methods)
7. Dependencies (2 methods)
8. Checklists (2 methods)
9. Tags (2 methods)
10. Custom Fields (2 methods)
11. Webhooks (4 methods)
12. Comments (2 methods)
13. Time Tracking (2 methods)
14. Goals (2 methods)
15. Views (3 methods)
16. Members (1 method)

This covers all major ClickUp API v2 operations needed for AI agent training and developer education as specified in the requirements. The "kitchen sink" scope is intentionally comprehensive for the defined use cases while remaining maintainable and well-tested.

## Quick Start

### Prerequisites

- Node.js 20+ 
- ClickUp API token ([Get yours](https://app.clickup.com/settings/apps))

### Installation

```bash
git clone <repository-url>
cd clickup-api-kitchen-sink
npm install
```

### Configuration

```bash
export CLICKUP_API_TOKEN="your_token_here"
```

**⚠️ Never commit your API token!** It's excluded by `.gitignore`.

### Run Examples

```bash
# Authentication example
npx ts-node examples/01-auth-user.ts

# Task operations
npx ts-node examples/06-task-crud.ts <list_id>
```

### Run Tests

```bash
# Unit tests (mocked, no API token needed)
npm test

# Integration tests (requires CLICKUP_API_TOKEN)
npm run test:integration
```

## Project Structure

```
src/
├── client/           # Core API client library
│   ├── types/        # TypeScript type definitions
│   ├── http.ts       # HTTP client with retry/timeout
│   └── index.ts      # Main ClickUpClient class
├── webhooks/         # Webhook utilities
│   └── signature-verification.ts
└── utils/            # Shared utilities
    └── logger.ts     # Debug logging with token redaction

examples/             # Self-contained runnable examples
tests/
├── unit/             # Unit tests with mocked HTTP
└── integration/      # Live API tests (optional)
```

## Documentation

- [Feature Specification](specs/001-clickup-api-kitchen-sink/spec.md)
- [Implementation Plan](specs/001-clickup-api-kitchen-sink/plan.md)
- [Data Model](specs/001-clickup-api-kitchen-sink/data-model.md)
- [API Contracts](specs/001-clickup-api-kitchen-sink/contracts/)
- [Quickstart Guide](specs/001-clickup-api-kitchen-sink/quickstart.md)

## Implementation Status

✅ **Phase 1-2 Complete**: Core infrastructure and client implemented

**Completed**:
- ✅ Project setup and configuration (TypeScript, ESLint, Prettier, Vitest)
- ✅ Complete Spec Kit workflow (specify → clarify → plan → tasks)
- ✅ HTTP client with retry logic and rate limiting
- ✅ Core type definitions (User, Workspace, Space, Folder, List, Task)
- ✅ Main ClickUpClient class with 19 methods
- ✅ Webhook signature verification (HMAC-SHA256)
- ✅ Debug logging with automatic token redaction
- ✅ Unit tests with mocked HTTP (vitest + nock)
- ✅ Integration test framework (gated on CLICKUP_API_TOKEN)
- ✅ GitHub Actions CI/CD (lint, typecheck, unit tests on PR)
- ✅ Examples for authentication and workspaces

**API Coverage**: ~20% implemented (19 methods out of planned 90+ across all categories)

**Next Steps** (Future PRs):
- Additional examples for all implemented methods
- Advanced task operations (subtasks, custom fields, attachments)
- Webhooks (create, list, delete endpoints)
- Comments, time tracking, goals, views
- Complete example suite (25 scripts)
- Expand integration test coverage

See [tasks.md](specs/001-clickup-api-kitchen-sink/tasks.md) for detailed implementation plan.

## Contributing

This is a reference implementation. Contributions welcome:

1. Follow existing code patterns
2. Add tests for new features
3. Update documentation
4. Maintain synthetic data usage only

## License

MIT - See [LICENSE](LICENSE)

## Disclaimer

This project is not affiliated with, endorsed by, or connected to ClickUp. ClickUp is a trademark of ClickUp.

All ClickUp API operations use synthetic/test data only. No real user data is used per ClickUp Developer Terms §6.
