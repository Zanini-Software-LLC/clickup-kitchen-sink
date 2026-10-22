# Tasks: ClickUp API v2 Kitchen Sink Reference Implementation

**Input**: Design documents from `/specs/001-clickup-api-kitchen-sink/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Unit tests (with mocked HTTP) and optional integration tests (live API with cleanup) are included as specified in FR-008 and FR-009.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single project structure at repository root: `src/`, `examples/`, `tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project directory structure: `src/client/`, `src/client/types/`, `src/webhooks/`, `src/utils/`, `examples/`, `tests/unit/`, `tests/integration/`, `.github/workflows/`
- [ ] T002 Initialize Node.js project with TypeScript: `package.json` with name, version, license MIT, engines node >=20.0.0, type: module
- [ ] T003 [P] Install core dependencies: `axios` (HTTP client), `debug` (logging), and dev dependencies: `typescript@^5`, `@types/node`, `vitest`, `nock`, `eslint`, `prettier`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`
- [ ] T004 [P] Configure TypeScript in `tsconfig.json`: target ES2022, module ES2022, moduleResolution bundler, strict true, esModuleInterop true, declaration true, outDir dist/, include src/ examples/ tests/
- [ ] T005 [P] Configure ESLint in `.eslintrc.json`: @typescript-eslint recommended rules, no-console allowed, no-unused-vars error
- [ ] T006 [P] Configure Prettier in `.prettierrc`: printWidth 100, singleQuote true, trailingComma all, semi true, tabWidth 2
- [ ] T007 [P] Configure vitest in `vitest.config.ts`: test environment node, coverage provider v8, include tests/**/*.test.ts
- [ ] T008 [P] Create `.gitignore`: node_modules/, dist/, .env, .env.*, coverage/, *.log
- [ ] T009 [P] Add npm scripts to `package.json`: `build` (tsc), `lint` (eslint), `format` (prettier), `typecheck` (tsc --noEmit), `test` (vitest run), `test:watch` (vitest), `test:coverage` (vitest --coverage), `test:integration` (vitest --run tests/integration), `ci` (lint && typecheck && test)
- [ ] T010 Create MIT `LICENSE` file with copyright year 2026
- [ ] T011 Create initial `README.md` with UNOFFICIAL disclaimer: "This is an UNOFFICIAL reference implementation. Not affiliated with or endorsed by ClickUp. See ClickUp Developer Terms: https://clickup.com/terms"
- [ ] T012 Create initial `CHANGELOG.md` with version 0.1.0 and "Initial reference implementation" entry

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T013 Create common types in `src/client/types/common.ts`: Status interface (id, status, type: 'open'|'closed'|'custom', orderindex, color), Priority interface (id, priority: 'urgent'|'high'|'normal'|'low', color, orderindex), ClickUpAPIError class (extends Error, constructor with message, statusCode, errorCode?, response?)
- [ ] T014 Create User type in `src/client/types/user.ts`: User interface (id: number, username, email, color, profilePicture: string|null, initials, week_start_day: number, global_font_support: boolean, timezone)
- [ ] T015 [P] Implement token redaction utility in `src/utils/logger.ts`: redactSensitiveData function that replaces Authorization headers with [REDACTED] and replaces any object key containing "token", "secret", "password", "key" (case-insensitive) with [REDACTED], setup debug namespaces clickup:http, clickup:retry, clickup:pagination
- [ ] T016 Implement HTTP client in `src/client/http.ts`: AxiosHttpClient class with constructor(apiToken, options: {baseURL='https://api.clickup.com/api/v2', timeout=30000, maxRetries=5, debug=process.env.DEBUG}), private axiosInstance with Authorization header, 30-second timeout, response interceptor for 429 rate limiting with exponential backoff (1s, 2s, 4s, 8s, 16s) respecting Retry-After header, retry count tracking via config._retryCount, throw ClickUpAPIError for errors, debug logging with token redaction via logger.ts
- [ ] T017 Create base ClickUpClient class in `src/client/index.ts`: constructor(apiToken, options?), private httpClient property, export ClickUpClient as default and named export

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - API Learning and Reference (Priority: P1) 🎯 MVP Part 1

**Goal**: Create comprehensive, well-commented examples with JSDoc links to official ClickUp API documentation for all major API operations

**Independent Test**: Read example files and verify each has JSDoc header linking to https://developer.clickup.com/reference/[endpoint], run examples and verify they execute successfully, check that examples follow consistent structure from contracts/example-structure.md

### Implementation for User Story 1

- [ ] T018 [P] [US1] Create example template header comment standard: JSDoc with "Example: [Operation]", "Demonstrates: [what it shows]", "Prerequisites: [requirements]", "Usage: [command]", "API Reference: [ClickUp docs URL]", "@see [implementation file]"
- [ ] T019 [P] [US1] Create README feature table structure in `README.md`: table with columns "Example | Category | Description | API Docs", add setup section with "Get API token from https://app.clickup.com/settings/apps", add environment variable instructions "export CLICKUP_API_TOKEN=your_token"
- [ ] T020 [P] [US1] Document example script structure in `README.md`: explain numbering convention (01-09 core, 10-22 advanced, 23-24 infrastructure, 99 e2e), self-contained nature, consistent error handling pattern, both human and machine-readable output

**Checkpoint**: Documentation structure ready for examples to reference

---

## Phase 4: User Story 2 - Authentication and Basic Operations (Priority: P1) 🎯 MVP Part 2

**Goal**: Implement authentication, user info, and basic CRUD operations for workspaces, spaces, folders, lists, tasks

**Independent Test**: Run authentication example and verify it retrieves user info, run hierarchy navigation examples and verify workspace → space → folder → list traversal works, run task CRUD example and verify create/read/update/delete operations succeed

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T021 [P] [US2] Unit test for authentication in `tests/unit/client/auth.test.ts`: mock GET /user with 200 response, verify getUser returns User object, mock 401 response and verify ClickUpAPIError thrown with statusCode 401
- [ ] T022 [P] [US2] Unit test for HTTP client in `tests/unit/client/http.test.ts`: test timeout after 30 seconds, test rate limit retry with 429 response and Retry-After header, verify exponential backoff (1s, 2s, 4s, 8s, 16s), test max 5 retries then throw ClickUpAPIError, test token redaction in debug logs
- [ ] T023 [P] [US2] Integration test setup in `tests/integration/setup.ts`: create test space with name CLICKUP_KITCHEN_SINK_TEST_${timestamp}, create test list, export cleanup function that deletes in reverse order (tasks, lists, folders, spaces), skip gracefully if CLICKUP_API_TOKEN unset

### Implementation for User Story 2

- [ ] T024 [P] [US2] Create Workspace types in `src/client/types/workspace.ts`: Workspace interface (id, name, color, avatar: string|null, members: Member[]), Member interface (user: User, invited_by?: User)
- [ ] T025 [P] [US2] Create Space types in `src/client/types/space.ts`: Space interface (id, name, color: string|null, private: boolean, avatar: string|null, admin_can_manage: boolean, statuses: Status[], multiple_assignees: boolean, features: SpaceFeatures), SpaceFeatures interface (due_dates, sprints, time_tracking, points, custom_fields, checklists, zoom, milestones - each with {enabled: boolean} and additional config)
- [ ] T026 [P] [US2] Create Folder type in `src/client/types/folder.ts`: Folder interface (id, name, orderindex: number, override_statuses: boolean, hidden: boolean, space: {id, name}, task_count: string, lists: List[])
- [ ] T027 [P] [US2] Create List type in `src/client/types/list.ts`: List interface (id, name, orderindex: number, content: string, status: Status|null, priority: Priority|null, assignee: User|null, task_count: number, due_date: string|null, start_date: string|null, folder: {id, name, hidden}, space: {id, name}, archived: boolean, override_statuses: boolean, statuses: Status[], permission_level: string)
- [ ] T028 [P] [US2] Create Task type in `src/client/types/task.ts`: Task interface (id, custom_id: string|null, name, text_content, description, status: Status, orderindex: string, date_created, date_updated, date_closed: string|null, creator: User, assignees: User[], watchers: User[], checklists: Checklist[], tags: Tag[], parent: string|null, priority: Priority|null, due_date: string|null, start_date: string|null, points: number|null, time_estimate: number|null, custom_fields: CustomFieldValue[], dependencies: Dependency[], linked_tasks: LinkedTask[], team_id, url, permission_level, list: {id, name}, project: {id, name}, folder: {id, name}, space: {id}), Tag interface (name, tag_fg, tag_bg, creator: number), LinkedTask interface (task_id, link_id, date_created, userid)
- [ ] T029 [US2] Implement getUser method in `src/client/index.ts`: async getUser(): Promise<User>, GET /user, return response.data.user, JSDoc with link to https://developer.clickup.com/reference/getauthorizeduser and @see examples/01-auth-user.ts
- [ ] T030 [US2] Implement getWorkspaces method in `src/client/index.ts`: async getWorkspaces(): Promise<Workspace[]>, GET /team, return response.data.teams, JSDoc with link to https://developer.clickup.com/reference/getauthorizedteams and @see examples/02-workspaces.ts
- [ ] T031 [US2] Implement getSpaces method in `src/client/index.ts`: async getSpaces(workspaceId: string): Promise<Space[]>, GET /team/${workspaceId}/space, return response.data.spaces, JSDoc with link to https://developer.clickup.com/reference/getspaces and @see examples/03-spaces.ts
- [ ] T032 [US2] Implement getSpace method in `src/client/index.ts`: async getSpace(spaceId: string): Promise<Space>, GET /space/${spaceId}, return response.data, throw ClickUpAPIError with 404 if not found, JSDoc with link to https://developer.clickup.com/reference/getspace
- [ ] T033 [US2] Implement createSpace method in `src/client/index.ts`: async createSpace(workspaceId: string, data: {name: string, multiple_assignees?: boolean, features?: Partial<SpaceFeatures>}): Promise<Space>, POST /team/${workspaceId}/space with data, return response.data, validate name is non-empty, JSDoc with link to https://developer.clickup.com/reference/createspace
- [ ] T034 [US2] Implement getFolders method in `src/client/index.ts`: async getFolders(spaceId: string): Promise<Folder[]>, GET /space/${spaceId}/folder, return response.data.folders, JSDoc with link to https://developer.clickup.com/reference/getfolders and @see examples/04-folders.ts
- [ ] T035 [US2] Implement getLists method in `src/client/index.ts`: async getLists(folderId: string): Promise<List[]>, GET /folder/${folderId}/list, return response.data.lists, JSDoc with link to https://developer.clickup.com/reference/getlists and @see examples/05-lists.ts
- [ ] T036 [US2] Implement getFolderlessLists method in `src/client/index.ts`: async getFolderlessLists(spaceId: string): Promise<List[]>, GET /space/${spaceId}/list, return response.data.lists, JSDoc with link to https://developer.clickup.com/reference/getfolderlesslists
- [ ] T037 [US2] Implement getTask method in `src/client/index.ts`: async getTask(taskId: string, options?: {custom_task_ids?: boolean, team_id?: string, include_subtasks?: boolean}): Promise<Task>, GET /task/${taskId}, return response.data, throw ClickUpAPIError with 404 if not found, JSDoc with link to https://developer.clickup.com/reference/gettask and @see examples/06-task-crud.ts
- [ ] T038 [US2] Implement createTask method in `src/client/index.ts`: async createTask(listId: string, data: {name: string, description?: string, assignees?: number[], tags?: string[], status?: string, priority?: number, due_date?: number, due_date_time?: boolean, time_estimate?: number, start_date?: number, start_date_time?: boolean, notify_all?: boolean, parent?: string, links_to?: string, custom_fields?: Array<{id: string, value: any}>}): Promise<Task>, POST /list/${listId}/task with data, validate name is required and non-empty, return response.data, JSDoc with link to https://developer.clickup.com/reference/createtask and @see examples/06-task-crud.ts
- [ ] T039 [US2] Implement updateTask method in `src/client/index.ts`: async updateTask(taskId: string, data: {name?: string, description?: string, status?: string, priority?: number|null, due_date?: number|null, due_date_time?: boolean, time_estimate?: number|null, start_date?: number|null, start_date_time?: boolean, assignees?: {add?: number[], rem?: number[]}}): Promise<Task>, PUT /task/${taskId} with data, return response.data, JSDoc with link to https://developer.clickup.com/reference/updatetask and @see examples/06-task-crud.ts
- [ ] T040 [US2] Implement deleteTask method in `src/client/index.ts`: async deleteTask(taskId: string): Promise<void>, DELETE /task/${taskId}, throw ClickUpAPIError with 404 if not found, JSDoc with link to https://developer.clickup.com/reference/deletetask and @see examples/06-task-crud.ts
- [ ] T041 [P] [US2] Create example `examples/01-auth-user.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/getauthorizeduser, validate CLICKUP_API_TOKEN env var with helpful error message, initialize ClickUpClient, call getUser(), display user info (username, email, ID), display full JSON response, handle ClickUpAPIError with specific messages for 401/403/404/429
- [ ] T042 [P] [US2] Create example `examples/02-workspaces.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/getauthorizedteams, validate token, call getWorkspaces(), display workspace names and IDs, display full JSON response, handle errors
- [ ] T043 [P] [US2] Create example `examples/03-spaces.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/getspaces, validate token, get first workspace or accept workspace ID as arg, call getSpaces(workspaceId), display space names and IDs, handle errors
- [ ] T044 [P] [US2] Create example `examples/04-folders.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/getfolders, validate token, accept space ID as arg or get from first workspace, call getFolders(spaceId), display folder names and IDs, handle errors
- [ ] T045 [P] [US2] Create example `examples/05-lists.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/getlists, validate token, accept folder ID or space ID as arg, call getLists or getFolderlessLists accordingly, display list names and IDs, handle errors
- [ ] T046 [US2] Create example `examples/06-task-crud.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/createtask, validate token, require list ID as command-line arg, demonstrate create task with name "Test Task from Kitchen Sink", read it back with getTask, update its description, delete it, display each step with progress indicators, handle errors
- [ ] T047 [P] [US2] Update README.md feature table: add rows for examples 01-06 with categories (Authentication, Hierarchy, Tasks), descriptions, and ClickUp API doc links

**Checkpoint**: At this point, authentication and basic CRUD operations are fully functional and testable independently

---

## Phase 5: User Story 3 - Advanced Task Operations (Priority: P2)

**Goal**: Implement and demonstrate advanced task features (subtasks, dependencies, checklists, tags, assignees, attachments, custom fields)

**Independent Test**: Run subtask example and verify parent-child relationship, run dependency example and verify blocks/blocked-by relationship, run checklist example and verify items are created and markable as complete, run custom field example and verify values are set correctly on task creation

### Tests for User Story 3

- [ ] T048 [P] [US3] Unit test for custom field operations in `tests/unit/client/custom-fields.test.ts`: mock GET /list/{list_id}/field, mock POST /task/{task_id}/field/{field_id}, verify setCustomFieldValue sends correct payload for text, number, dropdown types
- [ ] T049 [P] [US3] Integration test for task enhancements in `tests/integration/tasks.integration.test.ts`: create task, add subtask with parent field, verify parent-child relationship, add dependency, add checklist with items, add tags, verify all via getTask, cleanup all created resources

### Implementation for User Story 3

- [ ] T050 [P] [US3] Create Dependency type in `src/client/types/task.ts` (add to existing): Dependency interface (task_id, depends_on, type: 'waiting_on'|'blocking', date_created, userid), validate no circular dependencies in JSDoc comment
- [ ] T051 [P] [US3] Create Checklist type in `src/client/types/task.ts` (add to existing): Checklist interface (id, task_id, name, orderindex: number, resolved: number, unresolved: number, items: ChecklistItem[]), ChecklistItem interface (id, name, orderindex: number, assignee: User|null, resolved: boolean, parent: string|null, date_created, children: ChecklistItem[])
- [ ] T052 [P] [US3] Create CustomField types in `src/client/types/custom-field.ts`: CustomField interface (id, name, type: 'text'|'number'|'currency'|'date'|'drop_down'|'checkbox'|'url'|'email'|'phone'|'labels'|'users'|'location'|'rating', type_config: CustomFieldTypeConfig, date_created, hide_from_guests: boolean, required: boolean), CustomFieldTypeConfig interface (default?: number, placeholder?: string, options?: CustomFieldOption[], new_drop_down?: boolean), CustomFieldOption interface (id, name, color: string|null, orderindex: number), CustomFieldValue interface (id, name, type: string, type_config: CustomFieldTypeConfig, date_created, hide_from_guests: boolean, value: string|number|boolean|CustomFieldOption|null)
- [ ] T053 [US3] Implement addDependency method in `src/client/index.ts`: async addDependency(taskId: string, dependsOn: string, dependencyOf?: string): Promise<Dependency>, POST /task/${taskId}/dependency with depends_on and dependency_of fields, return response.data, JSDoc with link to https://developer.clickup.com/reference/adddependency and @see examples/08-dependencies.ts
- [ ] T054 [US3] Implement deleteDependency method in `src/client/index.ts`: async deleteDependency(taskId: string, dependsOn: string, dependencyOf?: string): Promise<void>, DELETE /task/${taskId}/dependency with query params, JSDoc with link to https://developer.clickup.com/reference/deletedependency
- [ ] T055 [US3] Implement createChecklist method in `src/client/index.ts`: async createChecklist(taskId: string, data: {name: string}): Promise<Checklist>, POST /task/${taskId}/checklist with data, return response.data, JSDoc with link to https://developer.clickup.com/reference/createchecklist and @see examples/09-checklists.ts
- [ ] T056 [US3] Implement createChecklistItem method in `src/client/index.ts`: async createChecklistItem(checklistId: string, data: {name: string, assignee?: number}): Promise<ChecklistItem>, POST /checklist/${checklistId}/checklist_item with data, return response.data, JSDoc with link to https://developer.clickup.com/reference/createchecklistitem and @see examples/09-checklists.ts
- [ ] T057 [US3] Implement addTag method in `src/client/index.ts`: async addTag(taskId: string, tagName: string): Promise<void>, POST /task/${taskId}/tag/${encodeURIComponent(tagName)}, JSDoc with link to https://developer.clickup.com/reference/addtagtotask and @see examples/10-tags.ts
- [ ] T058 [US3] Implement removeTag method in `src/client/index.ts`: async removeTag(taskId: string, tagName: string): Promise<void>, DELETE /task/${taskId}/tag/${encodeURIComponent(tagName)}, JSDoc with link to https://developer.clickup.com/reference/removetagfromtask
- [ ] T059 [US3] Implement getCustomFields method in `src/client/index.ts`: async getCustomFields(listId: string): Promise<CustomField[]>, GET /list/${listId}/field, return response.data.fields, JSDoc with link to https://developer.clickup.com/reference/getaccessiblecustomfields and @see examples/13-custom-fields.ts
- [ ] T060 [US3] Implement setCustomFieldValue method in `src/client/index.ts`: async setCustomFieldValue(taskId: string, fieldId: string, value: any): Promise<void>, POST /task/${taskId}/field/${fieldId} with {value}, JSDoc comment: value type must match field type (text: string, number: number, drop_down: option ID string, date: Unix timestamp milliseconds number, checkbox: boolean), link to https://developer.clickup.com/reference/setcustomfieldvalue and @see examples/13-custom-fields.ts
- [ ] T061 [P] [US3] Create example `examples/07-subtasks.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/createtask (subtask via parent field), validate token, require list ID as arg, create parent task, create subtask with parent field set to parent task ID, verify subtask appears in parent.subtasks when fetching parent, display both tasks, cleanup both tasks, handle errors
- [ ] T062 [P] [US3] Create example `examples/08-dependencies.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/adddependency, validate token, require list ID as arg, create task A and task B, add dependency (B depends on A), display dependency relationship, cleanup both tasks, handle errors
- [ ] T063 [P] [US3] Create example `examples/09-checklists.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/createchecklist, validate token, require list ID as arg, create task, create checklist with name "Test Checklist", add 3 checklist items with names "Item 1", "Item 2", "Item 3", display checklist structure, cleanup task (cascades to checklist), handle errors
- [ ] T064 [P] [US3] Create example `examples/10-tags.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/addtagtotask, validate token, require list ID as arg, create task, add tags "kitchen-sink", "test", "example", display task with tags, cleanup task, handle errors
- [ ] T065 [P] [US3] Create example `examples/11-assignees.ts`: demonstrate assigning users to task via createTask with assignees array or updateTask with assignees.add array, require list ID and user ID as args, create task with assignee, display assigned task, cleanup, handle errors, JSDoc header
- [ ] T066 [P] [US3] Create example `examples/12-attachments.ts`: demonstrate file attachment flow (note: actual file upload may require multipart/form-data handling), JSDoc header, placeholder implementation showing structure, note in comments that full implementation would require form-data library
- [ ] T067 [US3] Create example `examples/13-custom-fields.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/setcustomfieldvalue, validate token, require list ID as arg, call getCustomFields to list available fields, create task with custom_fields array in createTask data (show text, number, dropdown examples if fields exist), alternative: create task then use setCustomFieldValue, display task with custom field values, cleanup task, handle errors
- [ ] T068 [P] [US3] Update README.md feature table: add rows for examples 07-13 with categories (Advanced Tasks), descriptions, and ClickUp API doc links

**Checkpoint**: At this point, advanced task operations are fully functional and testable independently

---

## Phase 6: User Story 4 - Webhooks and Real-Time Updates (Priority: P2)

**Goal**: Implement webhook creation, listing, deletion, and signature verification for secure real-time event handling

**Independent Test**: Create webhook with test endpoint, verify it appears in list, trigger event and verify webhook delivers payload, verify signature validation correctly accepts valid signatures and rejects invalid ones, delete webhook and verify it no longer delivers events

### Tests for User Story 4

- [ ] T069 [P] [US4] Unit test for webhook signature verification in `tests/unit/webhooks/signature-verification.test.ts`: test verifyWebhookSignature returns true for valid HMAC-SHA256 signature, test returns false for invalid signature, test uses timing-safe comparison (crypto.timingSafeEqual), test with various payload sizes and secrets
- [ ] T070 [P] [US4] Integration test for webhooks in `tests/integration/webhooks.integration.test.ts`: create webhook for test list with taskCreated event, verify webhook appears in getWebhooks list, delete webhook, verify it no longer appears, cleanup

### Implementation for User Story 4

- [ ] T071 [P] [US4] Create Webhook types in `src/client/types/webhook.ts`: Webhook interface (id, userid: number, team_id, endpoint: string with validation comment "must be HTTPS URL", events: WebhookEvent[], task_id: string|null, list_id: string|null, folder_id: string|null, space_id: string|null, health: {status: 'active'|'failing', fail_count: number}, secret: string with comment "for HMAC-SHA256 signature verification"), WebhookEvent type union: 'taskCreated'|'taskUpdated'|'taskDeleted'|'taskPriorityUpdated'|'taskStatusUpdated'|'taskAssigneeUpdated'|'taskDueDateUpdated'|'taskTagUpdated'|'taskMoved'|'taskCommentPosted'|'taskCommentUpdated'|'taskTimeEstimateUpdated'|'taskTimeTrackedUpdated'|'listCreated'|'listUpdated'|'listDeleted'|'folderCreated'|'folderUpdated'|'folderDeleted'|'spaceCreated'|'spaceUpdated'|'spaceDeleted'|'goalCreated'|'goalUpdated'|'goalDeleted'
- [ ] T072 [US4] Implement webhook signature verification in `src/webhooks/signature-verification.ts`: export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean, use crypto.createHmac('sha256', secret).update(payload).digest('hex') to compute expected signature, use crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature)) for timing-safe comparison, return boolean, JSDoc with link to https://developer.clickup.com/docs/webhooks-signature-verification and @see examples/19-signature-verify.ts
- [ ] T073 [US4] Implement createWebhook method in `src/client/index.ts`: async createWebhook(workspaceId: string, data: {endpoint: string, events: WebhookEvent[], space_id?: string, folder_id?: string, list_id?: string, task_id?: string}): Promise<Webhook>, POST /team/${workspaceId}/webhook with data, validate endpoint starts with https://, validate events array has at least one event, return response.data including generated secret, JSDoc with link to https://developer.clickup.com/reference/createwebhook and @see examples/16-webhooks-create.ts
- [ ] T074 [US4] Implement getWebhooks method in `src/client/index.ts`: async getWebhooks(workspaceId: string): Promise<Webhook[]>, GET /team/${workspaceId}/webhook, return response.data.webhooks, JSDoc with link to https://developer.clickup.com/reference/getwebhooks and @see examples/17-webhooks-list.ts
- [ ] T075 [US4] Implement deleteWebhook method in `src/client/index.ts`: async deleteWebhook(webhookId: string): Promise<void>, DELETE /webhook/${webhookId}, JSDoc with link to https://developer.clickup.com/reference/deletewebhook and @see examples/18-webhooks-delete.ts
- [ ] T076 [P] [US4] Create example `examples/16-webhooks-create.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/createwebhook, validate token, require workspace ID as arg, require WEBHOOK_ENDPOINT env var or command-line arg (must be public HTTPS URL, suggest ngrok for testing), create webhook for events ['taskCreated', 'taskUpdated'], display webhook ID and secret (warn to save secret securely), handle errors
- [ ] T077 [P] [US4] Create example `examples/17-webhooks-list.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/getwebhooks, validate token, require workspace ID as arg, call getWebhooks, display webhook IDs, endpoints, events, health status, handle errors
- [ ] T078 [P] [US4] Create example `examples/18-webhooks-delete.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/deletewebhook, validate token, require webhook ID as arg, call deleteWebhook, confirm deletion success, handle errors
- [ ] T079 [US4] Create example `examples/19-signature-verify.ts`: JSDoc header with API Reference https://developer.clickup.com/docs/webhooks-signature-verification, demonstrate webhook handler using Express or Node http server on port 3000, POST /webhook endpoint, read raw body as string, extract X-Signature header, call verifyWebhookSignature with body, signature, and secret from env WEBHOOK_SECRET, respond 401 if invalid signature with error message, respond 200 if valid and log event details, include instructions to run with ngrok for public endpoint, handle errors
- [ ] T080 [P] [US4] Update README.md feature table: add rows for examples 16-19 with category Webhooks, descriptions, and ClickUp API doc links

**Checkpoint**: At this point, webhook operations and signature verification are fully functional and testable independently

---

## Phase 7: User Story 5 - Rate Limiting and Pagination (Priority: P2)

**Goal**: Demonstrate automatic rate limit handling with retry logic and pagination for large result sets

**Independent Test**: Run rate limiting example and observe automatic retries when 429 is encountered, run pagination example with large task list and verify all tasks are retrieved without duplicates or missing items

### Tests for User Story 5

- [ ] T081 [P] [US5] Unit test for rate limiter in `tests/unit/client/rate-limiter.test.ts`: test exponential backoff delays (1s, 2s, 4s, 8s, 16s), test respects Retry-After header, test max 5 retries then throws ClickUpAPIError, test retry count tracking in config._retryCount, mock multiple 429 responses followed by 200 success
- [ ] T082 [P] [US5] Unit test for pagination in `tests/unit/client/pagination.test.ts`: test paginateTasks async generator, mock first page with cursor, mock second page with cursor, mock third page without cursor (end), verify all pages yielded, verify no duplicate task IDs across pages

### Implementation for User Story 5

- [ ] T083 [US5] Implement getTasks method in `src/client/index.ts`: async getTasks(listId: string, options?: {archived?: boolean, page?: number, order_by?: string, reverse?: boolean, subtasks?: boolean, statuses?: string[], include_closed?: boolean, assignees?: number[], tags?: string[], due_date_gt?: number, due_date_lt?: number, date_created_gt?: number, date_created_lt?: number, date_updated_gt?: number, date_updated_lt?: number}): Promise<{tasks: Task[], cursor?: string}>, GET /list/${listId}/task with query params, return response.data, JSDoc with link to https://developer.clickup.com/reference/gettasks and @see examples/24-pagination.ts
- [ ] T084 [US5] Implement paginateTasks async generator in `src/client/index.ts`: async *paginateTasks(listId: string, options?: GetTasksOptions): AsyncGenerator<Task[], void, undefined>, loop: call getTasks with cursor from previous response, yield tasks array, continue while cursor exists, JSDoc comment: "Automatically fetches all pages of tasks using cursor-based pagination (FR-006)", link to https://developer.clickup.com/reference/gettasks and @see examples/24-pagination.ts
- [ ] T085 [P] [US5] Create example `examples/23-rate-limiting.ts`: demonstrate rate limit handling by making rapid API calls (e.g., create 10 tasks quickly), use DEBUG=clickup:retry environment variable to show retry logs, display when 429 is encountered and retry attempts, verify all operations eventually succeed or fail gracefully after 5 retries, cleanup created tasks, JSDoc header explaining this demonstrates automatic retry logic from FR-005 and FR-017, handle errors
- [ ] T086 [P] [US5] Create example `examples/24-pagination.ts`: JSDoc header with API Reference https://developer.clickup.com/reference/gettasks, validate token, require list ID as arg, demonstrate paginateTasks async generator with for await loop, display page number and task count per page, calculate and display total task count across all pages, verify no duplicate task IDs, handle errors
- [ ] T087 [P] [US5] Update README.md feature table: add rows for examples 23-24 with category Infrastructure, descriptions explaining rate limiting and pagination demonstrations, and ClickUp API doc links

**Checkpoint**: At this point, rate limiting and pagination are fully functional and tested

---

## Phase 8: User Story 6 - Comprehensive Testing and CI/CD (Priority: P3)

**Goal**: Create complete test suite (unit + integration) and GitHub Actions CI/CD workflows for automated quality checks

**Independent Test**: Run unit tests and verify they pass without API token using mocked responses, run integration tests with CLICKUP_API_TOKEN and verify they create/cleanup test resources, run integration tests without token and verify they skip gracefully, trigger GitHub Actions workflow and verify all checks pass

### Implementation for User Story 6

- [ ] T088 [P] [US6] Create additional type files for remaining entities: `src/client/types/comment.ts` (Comment interface with id, comment: CommentContent[], comment_text, user: User, date, resolved: boolean, assignee: User|null, assigned_by: User|null, reactions: Reaction[]; CommentContent interface with text, type?: 'mention'|'link', attributes?: {id?: string, url?: string}; Reaction interface with reaction: string, user: User), `src/client/types/time-entry.ts` (TimeEntry interface with id, task: {id, name}|null, wid, user: User, billable: boolean, start, end: string|null, duration, description, tags: Tag[], at), `src/client/types/goal.ts` (Goal interface with id, name, team_id, date_created, start_date: string|null, due_date: string|null, description, private: boolean, archived: boolean, creator: User, color, pretty_id, multiple_owners: boolean, folder_id: string|null, members: User[], owners: User[], key_results: KeyResult[]; KeyResult interface with id, goal_id, name, creator: User, type: 'number'|'currency'|'boolean'|'percentage'|'automatic', unit: string|null, steps_start: number, steps_end: number, steps_current: number, completed: boolean, task_ids: string[], list_ids: string[]), `src/client/types/view.ts` (View interface with id, name, type: 'list'|'board'|'calendar'|'gantt'|'timeline'|'workload'|'activity'|'map'|'table', parent: {id, type: 'team'|'space'|'folder'|'list'}, grouping, divide, sorting, filters, columns, team_sidebar, settings; ViewFilter, ViewColumn interfaces)
- [ ] T089 [P] [US6] Implement remaining API methods for completeness: getComments, createComment in `src/client/index.ts` with JSDoc links to https://developer.clickup.com/reference/gettaskcomments and createtaskcomment, @see examples/14-comments.ts
- [ ] T090 [P] [US6] Implement createTimeEntry in `src/client/index.ts`: async createTimeEntry(workspaceId: string, data: {tid?: string, start: number, end?: number, duration: number, description?: string, billable?: boolean}): Promise<TimeEntry>, POST /team/${workspaceId}/time_entries with data, JSDoc with link to https://developer.clickup.com/reference/createtimeentry and @see examples/15-time-tracking.ts
- [ ] T091 [P] [US6] Implement getGoals in `src/client/index.ts`: async getGoals(workspaceId: string): Promise<Goal[]>, GET /team/${workspaceId}/goal, JSDoc with link to https://developer.clickup.com/reference/getgoals and @see examples/20-goals.ts
- [ ] T092 [P] [US6] Implement getViews in `src/client/index.ts`: async getViews(workspaceId: string): Promise<View[]>, GET /team/${workspaceId}/view, JSDoc with link to https://developer.clickup.com/reference/getviews and @see examples/21-views.ts
- [ ] T093 [P] [US6] Create remaining examples: `examples/14-comments.ts` (create task, add comment with createComment, list comments with getComments, display comments, cleanup), `examples/15-time-tracking.ts` (create time entry for task with start/duration, display time entry), `examples/20-goals.ts` (list goals in workspace, display goal names and targets), `examples/21-views.ts` (list views in workspace, display view names and types), `examples/22-members.ts` (demonstrate getting team members from workspace, display member names and roles), each with JSDoc headers and API Reference links
- [ ] T094 [US6] Create GitHub Actions workflow `.github/workflows/ci.yml`: trigger on pull_request and push to main, jobs.test with runs-on ubuntu-latest, steps: checkout, setup node 20.x, npm ci, npm run lint, npm run typecheck, npm test, upload coverage artifact if test coverage enabled
- [ ] T095 [US6] Create GitHub Actions workflow `.github/workflows/integration.yml`: trigger on workflow_dispatch only (manual), jobs.integration-test with runs-on ubuntu-latest, env CLICKUP_API_TOKEN from secrets.CLICKUP_API_TOKEN, steps: checkout, setup node 20.x, npm ci, npm run test:integration, comment: "This workflow uses repository secret CLICKUP_API_TOKEN. Configure it in repository settings → Secrets and variables → Actions."
- [ ] T096 [US6] Create integration test for authentication in `tests/integration/auth.integration.test.ts`: skip if CLICKUP_API_TOKEN unset with test.skipIf, call client.getUser(), verify user object returned with id and email, verify no ClickUpAPIError thrown
- [ ] T097 [US6] Expand integration test `tests/integration/tasks.integration.test.ts`: add tests for task CRUD operations using test space/list from setup, verify task creation returns task ID, verify task update changes properties, verify task deletion removes task, cleanup in afterAll hook
- [ ] T098 [P] [US6] Update README.md with CI/CD section: explain ci.yml runs on PRs (lint, typecheck, unit tests), explain integration.yml manual trigger with secret, add badge for CI status if using GitHub Actions
- [ ] T099 [P] [US6] Update README.md feature table: add rows for examples 14, 15, 20-22 with appropriate categories and links

**Checkpoint**: At this point, comprehensive testing and CI/CD automation are in place

---

## Phase 9: User Story 7 - End-to-End Workflow Example (Priority: P3)

**Goal**: Create comprehensive end-to-end example demonstrating realistic workflow integrating multiple API operations

**Independent Test**: Run end-to-end example script and verify it completes full workflow (auth → create task with custom fields → register webhook → update task → cleanup) successfully within 30 seconds excluding webhook wait time

### Implementation for User Story 7

- [ ] T100 [US7] Create example `examples/99-end-to-end.ts`: JSDoc header "End-to-End Workflow Example" demonstrating complete integration, validate CLICKUP_API_TOKEN, step 1: authenticate and get user info with getUser(), step 2: list workspaces and select first with getWorkspaces(), step 3: list spaces and select or create test space with getSpaces/createSpace, step 4: list lists and select or create test list with getLists/createList (requires implementing createList method), step 5: get custom fields for list with getCustomFields, step 6: create task with custom field values if fields available using createTask with custom_fields array, step 7: add subtask to task with createTask setting parent field, step 8: add checklist to task with createChecklist and createChecklistItem, step 9: register webhook for taskUpdated event with createWebhook (requires WEBHOOK_ENDPOINT env var, can skip if not set with warning), step 10: update task status to trigger webhook with updateTask, step 11: pause briefly to allow webhook delivery (setTimeout 2 seconds), step 12: cleanup - delete webhook with deleteWebhook, delete tasks (subtask first, then parent) with deleteTask, display "✅ End-to-end workflow complete!" with summary of operations performed, handle errors gracefully at each step with rollback/cleanup on failure, total runtime target <30 seconds excluding webhook wait
- [ ] T101 [US7] Implement createList helper method in `src/client/index.ts` if not already present: async createList(folderId: string, data: {name: string, content?: string, due_date?: number, priority?: number, assignee?: number, status?: string}): Promise<List>, POST /folder/${folderId}/list with data, return response.data, JSDoc with link to https://developer.clickup.com/reference/createlist
- [ ] T102 [P] [US7] Update README.md: add "End-to-End Example" section highlighting examples/99-end-to-end.ts as comprehensive workflow demonstration, explain it integrates multiple P1/P2 features, add note about WEBHOOK_ENDPOINT requirement for webhook portion

**Checkpoint**: All user stories implemented and independently testable

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final documentation

- [ ] T103 [P] Documentation: expand README.md with comprehensive setup section explaining prerequisites (Node 20+, ClickUp API token from https://app.clickup.com/settings/apps), installation steps (clone repo, npm install), configuration (export CLICKUP_API_TOKEN=...), running examples (npx ts-node examples/XX-name.ts), running tests (npm test for unit, npm run test:integration for live), debugging (DEBUG=clickup:* to enable debug logs with token redaction), add disclaimer prominently at top: "⚠️ UNOFFICIAL - This is an UNOFFICIAL reference implementation. Not affiliated with or endorsed by ClickUp. See ClickUp Developer Terms: https://clickup.com/terms. §6 prohibits using user data to train AI - this project uses synthetic data only."
- [ ] T104 [P] Documentation: complete feature table in README.md ensuring all 25 examples (01-24 plus 99) are listed with categories, descriptions, and API documentation links, verify SC-005 "README feature table provides direct navigation to both example code and official docs"
- [ ] T105 [P] Documentation: update CHANGELOG.md with detailed v1.0.0 release notes listing all implemented features (authentication, task CRUD, advanced operations, webhooks, rate limiting, pagination, testing, CI/CD), API coverage percentage (calculate from FR-002 list: 18+ categories), note compliance with FR-011 (synthetic data only) and FR-012 (no AI features)
- [ ] T106 [P] Code cleanup: review all files for consistent formatting with prettier, verify all imports follow "no inline imports" rule from always_applied_workspace_rules, ensure TypeScript strict mode catches all potential issues, verify no ESLint warnings
- [ ] T107 [P] Code cleanup: ensure all switch statements over unions/enums use exhaustive checking with never type in default case per typescript-exhaustive-switch rule from always_applied_workspace_rules
- [ ] T108 [P] Security: verify no secrets committed using git-secrets or similar tool, verify .gitignore excludes .env, .env.*, *.log, node_modules/, dist/, coverage/, verify CLICKUP_API_TOKEN never appears in any file except as env var reference process.env.CLICKUP_API_TOKEN, verify SC-008 "Zero API tokens or secrets committed to repository"
- [ ] T109 [P] Testing: verify unit test coverage ≥80% (SC-003), run npm run test:coverage and check coverage report, add additional unit tests for any uncovered branches in rate limiter, pagination, or error handling logic
- [ ] T110 [P] Testing: verify integration tests complete in <5 minutes (SC-004), optimize test suite if needed by running tests in parallel where possible or reducing redundant API calls
- [ ] T111 Validation: run all examples sequentially to verify they work end-to-end, use quickstart.md validation scenarios as checklist, verify examples 01-06 work (authentication, hierarchy, task CRUD), verify examples 07-13 work (advanced features), verify examples 14-15, 20-22 work (comments, time tracking, goals, views, members), verify examples 16-19 work (webhooks), verify examples 23-24 work (rate limiting, pagination), verify example 99 works (end-to-end), document any issues found
- [ ] T112 Final verification: confirm all functional requirements FR-001 through FR-022 are implemented, confirm all success criteria SC-001 through SC-012 are met, run CI pipeline locally (npm run ci) and verify all checks pass, verify quickstart.md instructions are accurate and up-to-date

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - Can start after foundation ready
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) + User Story 1 doc structure - Primary feature implementation
- **User Story 3 (Phase 5)**: Depends on User Story 2 (task operations) - Extends task functionality
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2) - Independent feature
- **User Story 5 (Phase 7)**: Depends on User Story 2 (getTasks method) - Extends with pagination
- **User Story 6 (Phase 8)**: Depends on User Stories 2-5 (testing those features) - Testing infrastructure
- **User Story 7 (Phase 9)**: Depends on User Stories 2-4 (integrates those features) - E2E integration
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Documentation structure - Independent
- **User Story 2 (P1)**: Authentication and basic CRUD - Independent after Foundational
- **User Story 3 (P2)**: Extends User Story 2 tasks - Depends on US2 Task type and client methods
- **User Story 4 (P2)**: Webhooks - Independent after Foundational
- **User Story 5 (P2)**: Rate limiting and pagination - Extends User Story 2 with pagination of tasks
- **User Story 6 (P3)**: Testing - Tests features from US2-US5
- **User Story 7 (P3)**: End-to-end - Integrates US2-US4 features

### Parallel Opportunities

- **Setup (Phase 1)**: Tasks T003-T012 marked [P] can run in parallel (different config files)
- **Foundational (Phase 2)**: Tasks T014-T015 marked [P] can run in parallel (different type files, separate logger)
- **User Story 2**: Test tasks T021-T023 marked [P] can run in parallel, type tasks T024-T028 marked [P] can run in parallel, example tasks T041-T045 + T047 marked [P] can run in parallel
- **User Story 3**: Test tasks T048-T049 marked [P] can run in parallel, type tasks T050-T052 marked [P] can run in parallel, example tasks T061-T067 + T068 marked [P] can run in parallel
- **User Story 4**: Test tasks T069-T070 marked [P] can run in parallel, type task T071 and examples T076-T078 marked [P] can run in parallel
- **User Story 5**: Test tasks T081-T082 marked [P] can run in parallel, example tasks T085-T087 marked [P] can run in parallel
- **User Story 6**: Type tasks T088 and example tasks T089-T093 + T098-T099 marked [P] can run in parallel
- **Polish (Phase 10)**: Tasks T103-T110 marked [P] can run in parallel (different concerns)

---

## Parallel Example: User Story 2 (Primary Implementation)

After Foundational phase completes, launch these User Story 2 tasks in parallel:

```bash
# Tests (write first, ensure they fail):
Task T021: "Unit test for authentication in tests/unit/client/auth.test.ts"
Task T022: "Unit test for HTTP client in tests/unit/client/http.test.ts"
Task T023: "Integration test setup in tests/integration/setup.ts"

# Type definitions (no dependencies):
Task T024: "Create Workspace types in src/client/types/workspace.ts"
Task T025: "Create Space types in src/client/types/space.ts"
Task T026: "Create Folder type in src/client/types/folder.ts"
Task T027: "Create List type in src/client/types/list.ts"
Task T028: "Create Task type in src/client/types/task.ts"

# Later, after client methods complete, examples can run in parallel:
Task T041: "Create example examples/01-auth-user.ts"
Task T042: "Create example examples/02-workspaces.ts"
Task T043: "Create example examples/03-spaces.ts"
Task T044: "Create example examples/04-folders.ts"
Task T045: "Create example examples/05-lists.ts"
Task T047: "Update README.md feature table"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup → Project structure ready
2. Complete Phase 2: Foundational → Core types, HTTP client, logger ready
3. Complete Phase 3: User Story 1 → Documentation structure ready
4. Complete Phase 4: User Story 2 → Authentication and basic CRUD working
5. **STOP and VALIDATE**: Test User Story 2 examples independently (run examples 01-06, verify they work)
6. Deploy/demo if ready (working authentication + task CRUD = valuable reference code)

**MVP Deliverable**: Examples 01-06 demonstrating authentication and basic task operations with official API doc links.

### Incremental Delivery

1. MVP (US1 + US2) → Test independently → Deploy/Demo → **API reference value already delivered**
2. Add User Story 3 (advanced tasks) → Test independently → Deploy/Demo → **Advanced features demonstrated**
3. Add User Story 4 (webhooks) → Test independently → Deploy/Demo → **Real-time integration patterns shown**
4. Add User Story 5 (rate limiting, pagination) → Test independently → Deploy/Demo → **Production-ready patterns complete**
5. Add User Story 6 (testing, CI/CD) → Verify quality → Deploy/Demo → **Quality assurance automated**
6. Add User Story 7 (end-to-end) → Final integration test → Deploy/Demo → **Comprehensive workflow demonstrated**
7. Polish (Phase 10) → Final cleanup and documentation → **Production-ready release**

Each phase adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (prerequisite for all stories)
2. Once Foundational done:
   - **Developer A**: User Story 2 (authentication, basic CRUD) - P1 priority
   - **Developer B**: User Story 4 (webhooks) - P2 priority, independent of US2
   - **Developer C**: User Story 1 (documentation structure) - P1 priority, independent
3. After US2 complete:
   - **Developer A**: User Story 3 (advanced tasks) - extends US2
   - **Developer B**: Continues US4 (webhooks)
   - **Developer C**: User Story 5 (rate limiting, pagination) - extends US2
4. Stories complete and integrate independently

---

## Notes

- **[P] tasks**: Different files, no dependencies, can run in parallel
- **[Story] labels**: Map tasks to user stories for traceability (US1-US7)
- **Test-first approach**: Unit/integration tests written before implementation per FR-008, FR-009
- **Each user story**: Independently completable and testable (per spec.md user story structure)
- **File paths**: All tasks include exact file paths for clarity
- **API coverage**: SC-001 requires 90%+ coverage - tasks implement 18+ API operation categories from FR-002
- **Commit strategy**: Commit after each task or logical group for incremental progress
- **Checkpoints**: Stop at phase checkpoints to validate story works independently before proceeding
- **Constraints from clarifications**: 5 retry attempts (FR-017), 30-second timeout (FR-021), debug logging with token redaction (FR-022)
- **Security**: No real user data (FR-011), no AI features (FR-012), MIT license (FR-015)
- **Quality gates**: Lint, typecheck, and unit tests pass before any PR (FR-010), integration tests manual trigger with secret
