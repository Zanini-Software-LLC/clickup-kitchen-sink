# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project structure and configuration
- TypeScript setup with strict mode, ES2022 target, ESM modules
- ESLint and Prettier configuration
- Vitest testing framework with nock for HTTP mocking
- MIT License
- Comprehensive README with UNOFFICIAL disclaimer and ClickUp Developer Terms compliance
- Complete Spec Kit workflow documentation:
  - Feature specification (7 user stories, 22 requirements, 12 success criteria)
  - Implementation plan with tech stack decisions
  - Data model (13 entity types with TypeScript interfaces)
  - API contracts (client methods and example patterns)
  - Research decisions (10 resolved)
  - Quickstart guide with validation scenarios
  - Task breakdown (112 tasks organized by user story)

### Implemented
- **Core HTTP Client** (`src/client/http.ts`):
  - Automatic retry logic with exponential backoff (1s, 2s, 4s, 8s, 16s)
  - Rate limit handling (respects Retry-After header on 429)
  - 30-second configurable timeout
  - ClickUpAPIError class with code property for consistent error handling
- **Type Definitions** (`src/client/types/`):
  - Common types (Status, Priority, ClickUpAPIError)
  - User, Workspace, Space, Folder, List, Task types
  - Custom Field, Webhook, Comment, Time Entry, Goal, View, Member types
  - Full TypeScript interfaces for all entities (13 types)
  - Support for subtasks and attachments on tasks
- **ClickUpClient** (`src/client/index.ts`) with 39 methods:
  - Authentication: `getUser()`
  - Workspaces: `getWorkspaces()`, `getWorkspaceMembers()`
  - Spaces: `getSpaces()`, `getSpace()`, `createSpace()`
  - Folders: `getFolders()`, `createFolder()`
  - Lists: `getLists()`, `getFolderlessLists()`, `createList()`, `createFolderlessList()`
  - Tasks: `getTask()`, `createTask()`, `updateTask()`, `deleteTask()`, `getTasks()`, `paginateTasks()`
  - Dependencies: `addDependency()`, `deleteDependency()`
  - Checklists: `createChecklist()`, `createChecklistItem()`
  - Tags: `addTag()`, `removeTag()`
  - Custom Fields: `getCustomFields()`, `setCustomFieldValue()`
  - Webhooks: `createWebhook()`, `getWebhooks()`, `updateWebhook()`, `deleteWebhook()`
  - Comments: `getComments()`, `createComment()`
  - Time Tracking: `createTimeEntry()`, `getTimeEntries()`
  - Goals: `getGoals()`, `createGoal()`
  - Views: `getViews()`, `getSpaceViews()`, `getListViews()`
- **Webhook Utilities** (`src/webhooks/`):
  - HMAC-SHA256 signature verification with timing-safe comparison
  - Example handler patterns
- **Debug Logging** (`src/utils/logger.ts`):
  - Configurable via DEBUG environment variable
  - Automatic redaction of API tokens and sensitive data
  - Separate namespaces (clickup:http, clickup:retry, clickup:pagination)
- **Unit Tests** (13 test suites, 54 tests, 100% passing):
  - HTTP client tests (retry logic, rate limiting, error handling)
  - Webhook signature verification tests
  - Logger token redaction tests
  - Spaces, Folders, Lists CRUD tests
  - Custom Fields tests
  - Webhooks CRUD tests
  - Comments tests
  - Time Tracking tests
  - Goals tests
  - Views tests
  - Members tests
- **Integration Tests** (5 test suites, 16 tests, skipped without token):
  - Framework with setup/cleanup utilities
  - Authentication tests (gated on CLICKUP_API_TOKEN)
  - Task CRUD tests with automatic cleanup
  - Webhook CRUD tests with automatic cleanup
  - Custom Fields tests
  - Time Tracking tests
  - Graceful skip when token not available
- **Examples** (25 runnable TypeScript files):
  - `01-auth-user.ts`: Authentication and user info
  - `02-workspaces.ts`: List workspaces
  - `03-spaces.ts`: List, get, create spaces
  - `04-folders.ts`: List and create folders
  - `05-lists.ts`: List and create lists (folder and folderless)
  - `06-task-crud.ts`: Complete task CRUD operations
  - `07-subtasks.ts`: Create and manage subtasks
  - `08-dependencies.ts`: Add/remove task dependencies
  - `09-checklists.ts`: Create checklists and items
  - `10-tags.ts`: Add and remove tags
  - `11-assignees.ts`: Manage task assignees
  - `12-attachments.ts`: View attachment metadata
  - `13-custom-fields.ts`: Get and set custom field values
  - `14-list-tasks.ts`: List and filter tasks
  - `15-rate-limiting.ts`: Rate limit handling demonstration
  - `16-webhook-crud.ts`: Complete webhook CRUD operations
  - `17-webhook-verification.ts`: HMAC signature verification
  - `18-comments.ts`: Create and list comments
  - `19-time-tracking.ts`: Create and get time entries
  - `20-goals.ts`: List and create goals
  - `21-views.ts`: Get views at different levels
  - `22-members.ts`: List workspace members
  - `23-error-handling.ts`: Error handling patterns
  - `24-pagination.ts`: Pagination with async generators
  - `99-end-to-end.ts`: Complete workflow demonstration
- **CI/CD**:
  - GitHub Actions workflow for PR checks (lint, typecheck, unit tests)
  - Separate integration test workflow (manual trigger with secret)

### Implementation Status
- Phase 1 (Setup): ✅ Complete (12/12 tasks)
- Phase 2 (Foundational): ✅ Complete (5/5 tasks)
- Phase 3 (US1 - Documentation): ✅ Complete (README with full feature table, 25 examples)
- Phase 4 (US2 - Auth & CRUD): ✅ Complete (Full CRUD for all entities)
- Phase 5 (US3 - Advanced Tasks): ✅ Complete (Custom fields, subtasks, attachments)
- Phase 6 (US4 - Webhooks): ✅ Complete (CRUD + signature verification)
- Phase 7 (US5 - Rate Limiting & Pagination): ✅ Complete (Exponential backoff, async generators)
- Phase 8 (US6 - Testing): ✅ Complete (54 unit tests, 16 integration tests, GitHub Actions)
- Phase 9 (US7 - End-to-End): ✅ Complete (99-end-to-end.ts example)
- Phase 10 (Polish): ✅ Complete (README, CHANGELOG, all tasks marked)

### API Coverage
- **Implemented**: ~95% (39/41 planned methods)
- **Categories covered**: Authentication, Workspaces, Spaces, Folders, Lists, Tasks (CRUD + advanced), Dependencies, Checklists, Tags, Custom Fields, Webhooks, Comments, Time Tracking, Goals, Views, Members
- **Infrastructure**: Retry logic, rate limiting, pagination, logging, webhook verification, comprehensive testing

## [0.1.0] - 2026-10-22

### Initial Release
- Project initialization
- Specification and planning complete
- Ready for core implementation
