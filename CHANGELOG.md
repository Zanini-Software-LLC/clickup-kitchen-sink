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
  - Automatic retry logic with exponential backoff
  - Rate limit handling (respects Retry-After header)
  - 30-second configurable timeout
  - ClickUpAPIError class for consistent error handling
- **Type Definitions** (`src/client/types/`):
  - Common types (Status, Priority, ClickUpAPIError)
  - User, Workspace, Space, Folder, List, Task types
  - Full TypeScript interfaces for all entities
- **ClickUpClient** (`src/client/index.ts`) with 19 methods:
  - Authentication: `getUser()`
  - Workspaces: `getWorkspaces()`
  - Spaces: `getSpaces()`, `getSpace()`
  - Folders: `getFolders()`
  - Lists: `getLists()`, `getFolderlessLists()`
  - Tasks: `getTask()`, `createTask()`, `updateTask()`, `deleteTask()`, `getTasks()`, `paginateTasks()`
  - Dependencies: `addDependency()`, `deleteDependency()`
  - Checklists: `createChecklist()`, `createChecklistItem()`
  - Tags: `addTag()`, `removeTag()`
- **Webhook Utilities** (`src/webhooks/`):
  - HMAC-SHA256 signature verification with timing-safe comparison
- **Debug Logging** (`src/utils/logger.ts`):
  - Configurable via DEBUG environment variable
  - Automatic redaction of API tokens and sensitive data
  - Separate namespaces (clickup:http, clickup:retry, clickup:pagination)
- **Unit Tests** (3 test suites, 100% passing):
  - HTTP client tests (retry logic, rate limiting, error handling)
  - Webhook signature verification tests
  - Logger token redaction tests
- **Integration Tests**:
  - Framework with setup/cleanup utilities
  - Authentication tests (gated on CLICKUP_API_TOKEN)
  - Graceful skip when token not available
- **Examples**:
  - `01-auth-user.ts`: Authentication and user info
  - `02-workspaces.ts`: List workspaces
- **CI/CD**:
  - GitHub Actions workflow for PR checks (lint, typecheck, unit tests)
  - Separate integration test workflow (manual trigger with secret)

### Implementation Status
- Phase 1 (Setup): ✅ Complete (12/12 tasks)
- Phase 2 (Foundational): ✅ Complete (5/5 tasks)
- Phase 3 (US1 - Documentation): 🔄 Partial (README structure, examples started)
- Phase 4 (US2 - Auth & CRUD): ✅ Core Complete (19 client methods, basic examples, tests)
- Phases 5-10: ⏳ Planned

### API Coverage
- **Implemented**: ~20% (19/90+ methods)
- **Categories covered**: Authentication, Workspaces, Spaces, Folders, Lists, Tasks (CRUD), Dependencies, Checklists, Tags
- **Infrastructure**: Retry logic, rate limiting, pagination, logging, webhook verification

## [0.1.0] - 2026-10-22

### Initial Release
- Project initialization
- Specification and planning complete
- Ready for core implementation
