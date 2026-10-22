# Feature Specification: ClickUp API v2 Kitchen Sink Reference Implementation

**Feature Branch**: `001-clickup-api-kitchen-sink`

**Created**: 2026-10-22

**Status**: Draft

**Input**: User description: "Build an UNOFFICIAL ClickUp API v2 'kitchen sink' sample app in this repo, open-sourced (MIT) as reference code that will be indexed into a knowledge graph to teach AI agents how to use the ClickUp API."

## Clarifications

### Session 2026-10-22

- Q: What should be the maximum number of retry attempts when handling persistent rate limiting (HTTP 429) before giving up? → A: 5 retry attempts with exponential backoff (1s, 2s, 4s, 8s, 16s)
- Q: What should be the HTTP request timeout value for API calls before considering the connection failed? → A: 30 second HTTP request timeout
- Q: Should the client library log detailed request/response information for debugging, and if so, at what level? → A: Configurable debug logging via DEBUG env var, with automatic token redaction in logs

## User Scenarios & Testing *(mandatory)*

### User Story 1 - API Learning and Reference (Priority: P1)

AI agents and developers need a comprehensive, working reference implementation that demonstrates how to correctly use the ClickUp API v2 across all major endpoints and features.

**Why this priority**: Primary goal - the reference code exists to teach proper API usage patterns. Without this, the entire project has no value.

**Independent Test**: Can be fully tested by reading the code examples, running individual example scripts, and verifying that each script includes accurate JSDoc linking to official ClickUp documentation.

**Acceptance Scenarios**:

1. **Given** an AI agent learning the ClickUp API, **When** it queries for "how to create a task with custom fields", **Then** it finds a well-commented TypeScript example with inline JSDoc links to the exact ClickUp API documentation page
2. **Given** a developer new to ClickUp API, **When** they browse the examples directory, **Then** they find self-contained, runnable examples for every major API capability (auth, tasks, webhooks, custom fields, etc.)
3. **Given** a code indexing system, **When** it parses the repository, **Then** it extracts clear mappings between API operations and their official documentation URLs

---

### User Story 2 - Authentication and Basic Operations (Priority: P1)

Developers need to authenticate with the ClickUp API and perform basic CRUD operations on core entities (workspaces, spaces, folders, lists, tasks).

**Why this priority**: Authentication and basic CRUD are the foundation - all other operations depend on these working correctly.

**Independent Test**: Can be tested by running authentication example, verifying token validation works, and executing basic CRUD examples that create/read/update/delete a task.

**Acceptance Scenarios**:

1. **Given** a valid ClickUp API token in environment variable CLICKUP_API_TOKEN, **When** the authentication example runs, **Then** it successfully retrieves the authenticated user's information
2. **Given** access to a workspace, **When** the hierarchy navigation example runs, **Then** it traverses workspaces → spaces → folders → lists and displays the structure
3. **Given** access to a list, **When** the task CRUD example runs, **Then** it creates a new task, reads it back, updates its properties, and deletes it
4. **Given** no API token, **When** any example runs, **Then** it fails gracefully with a clear error message directing user to set CLICKUP_API_TOKEN

---

### User Story 3 - Advanced Task Operations (Priority: P2)

Developers need examples showing advanced task features including subtasks, dependencies, checklists, tags, assignees, attachments, and custom field values.

**Why this priority**: These features represent common real-world use cases and are frequently misunderstood in API integration.

**Independent Test**: Can be tested by running task enhancement examples that add each feature type to a test task and verify the results via API reads.

**Acceptance Scenarios**:

1. **Given** an existing task, **When** the subtask example runs, **Then** it creates nested subtasks and demonstrates the parent-child relationship
2. **Given** two tasks, **When** the dependency example runs, **Then** it establishes a "blocks/blocked-by" relationship between them
3. **Given** a task, **When** the checklist example runs, **Then** it adds a checklist with multiple items and marks some as complete
4. **Given** a list with custom fields defined, **When** the custom field example runs, **Then** it creates a task with specific custom field values (text, number, dropdown, date types)

---

### User Story 4 - Webhooks and Real-Time Updates (Priority: P2)

Developers need to understand how to create, list, delete webhooks and verify webhook signatures to receive real-time notifications of ClickUp changes.

**Why this priority**: Webhooks are critical for building responsive integrations but require proper signature verification for security.

**Independent Test**: Can be tested by creating a webhook pointing to a test endpoint, triggering an event in ClickUp, receiving the webhook payload, and successfully verifying its signature.

**Acceptance Scenarios**:

1. **Given** a valid API token and endpoint URL, **When** the webhook creation example runs, **Then** it registers a new webhook for specific event types
2. **Given** registered webhooks, **When** the webhook listing example runs, **Then** it retrieves and displays all active webhooks with their configurations
3. **Given** an incoming webhook HTTP request, **When** the signature verification handler processes it, **Then** it correctly validates the X-Signature header against the webhook secret
4. **Given** a webhook ID, **When** the webhook deletion example runs, **Then** it removes the webhook and confirms it no longer receives events

---

### User Story 5 - Rate Limiting and Pagination (Priority: P2)

Developers need examples demonstrating proper handling of API rate limits (HTTP 429 responses with retry logic) and pagination for endpoints returning large result sets.

**Why this priority**: Production integrations must handle rate limits gracefully and efficiently paginate through large datasets.

**Independent Test**: Can be tested by artificially triggering rate limit scenarios and verifying retry-with-backoff behavior, plus paginating through a large list of tasks.

**Acceptance Scenarios**:

1. **Given** a rate-limited API call, **When** it receives HTTP 429, **Then** the client automatically retries after the duration specified in Retry-After header
2. **Given** a list with 200 tasks, **When** the pagination example runs, **Then** it fetches all tasks across multiple pages without duplicates or missing items
3. **Given** exponential backoff configuration, **When** multiple 429 responses occur, **Then** the client increases wait time between retries (e.g., 1s, 2s, 4s, 8s)

---

### User Story 6 - Comprehensive Testing and CI/CD (Priority: P3)

The project needs both isolated unit tests (with mocked HTTP) and optional live integration tests that run against the real ClickUp API with proper cleanup.

**Why this priority**: Testing ensures code correctness and serves as living documentation, but this is infrastructure supporting the primary reference code goal.

**Independent Test**: Can be tested by running the unit test suite (all tests pass with mocked responses), then running live integration tests with CLICKUP_API_TOKEN set (creates/cleans up real resources).

**Acceptance Scenarios**:

1. **Given** no API token, **When** unit tests run via CI, **Then** all tests pass using mocked HTTP responses without making real API calls
2. **Given** CLICKUP_API_TOKEN environment variable set, **When** integration tests run, **Then** they create a dedicated test space/list, run all tests, and clean up all created resources
3. **Given** CLICKUP_API_TOKEN unset, **When** integration tests run, **Then** they skip gracefully with a clear message
4. **Given** a pull request, **When** GitHub Actions CI runs, **Then** it executes linting, type checking, and unit tests automatically

---

### User Story 7 - End-to-End Workflow Example (Priority: P3)

Developers need a complete example showing a realistic workflow: creating a task with custom field values, registering a webhook to monitor it, and handling webhook notifications.

**Why this priority**: Demonstrates how multiple API capabilities work together, but assumes understanding of individual operations from P1/P2 stories.

**Independent Test**: Can be tested by running the end-to-end example script and verifying it completes the full workflow successfully.

**Acceptance Scenarios**:

1. **Given** a configured workspace with custom fields, **When** the e2e example runs, **Then** it creates a task, populates custom fields, registers a webhook, simulates an update, receives the webhook, and cleans up
2. **Given** the e2e example code, **When** a developer reads it, **Then** they see clear comments explaining each step and why it's necessary

---

### Edge Cases

- What happens when API token is invalid or expired? (Each example must fail fast with clear error message)
- What happens when rate limit is exceeded persistently? (Client retries up to 5 times with exponential backoff, then fails gracefully with descriptive error)
- What happens when webhook signature validation fails? (Handler must reject the payload and log security warning)
- What happens when pagination cursor becomes invalid? (Client should detect and handle gracefully)
- What happens when custom field types don't match expected values? (Validation errors should be caught and reported clearly)
- What happens when workspace/space/list/task is deleted during operation? (404 errors should be handled with appropriate messaging)
- What happens when network connection is interrupted? (Requests timeout after 30 seconds and can be retried by rate limit logic if applicable)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a TypeScript client library with full type definitions for ClickUp API v2 resources (User, Workspace, Space, Folder, List, Task, CustomField, Webhook, Comment, TimeEntry, Goal, View, Member)
- **FR-002**: System MUST include runnable example scripts covering authentication/user info, workspace/space/folder/list operations, task CRUD operations, subtask creation, task dependencies, checklists, tags, assignees, file attachments, custom field value setting, comments, time tracking, webhook management, signature verification, goals, views, team members
- **FR-003**: Every example file MUST be self-contained (runnable independently) with comprehensive JSDoc comments linking to the exact ClickUp API documentation URL (https://developer.clickup.com/reference/...)
- **FR-004**: System MUST read API token exclusively from environment variable CLICKUP_API_TOKEN, never logging, printing, or committing the token value
- **FR-005**: System MUST implement automatic rate limit handling: detect HTTP 429 responses, read Retry-After header, wait the specified duration, and retry the request
- **FR-006**: System MUST implement pagination support for list endpoints: automatically follow page cursors to retrieve complete result sets
- **FR-007**: System MUST implement webhook signature verification using HMAC-SHA256 to validate X-Signature header against webhook secret
- **FR-008**: System MUST include unit tests with mocked HTTP responses (using vitest + nock or msw) achieving meaningful code coverage of all client modules
- **FR-009**: System MUST include optional live integration tests that: create a dedicated test space/list, run operations against real API, clean up all created resources, skip gracefully when CLICKUP_API_TOKEN is unset
- **FR-010**: System MUST include GitHub Actions CI workflow that: runs linting, type checking, unit tests on every pull request; provides manual workflow_dispatch trigger for live integration tests using repository secret CLICKUP_API_TOKEN
- **FR-011**: System MUST use only synthetic/artificial data in all examples and tests - no real user data per ClickUp Developer Terms §6
- **FR-012**: System MUST NOT use or demonstrate ClickUp AI features (compliance with user requirements)
- **FR-013**: README MUST contain prominent "UNOFFICIAL" disclaimer, links to ClickUp Developer Terms, feature-to-example-to-docs mapping table, setup instructions, and how-to-run guide
- **FR-014**: System MUST maintain CHANGELOG.md documenting all feature additions and changes
- **FR-015**: System MUST be MIT licensed to allow unrestricted use as reference code
- **FR-016**: System MUST target Node.js 20+ runtime environment
- **FR-017**: System MUST implement exponential backoff for rate limit retries with maximum 5 attempts (1s, 2s, 4s, 8s, 16s delays)
- **FR-018**: All examples MUST handle errors gracefully with clear, actionable error messages
- **FR-019**: Type definitions MUST accurately reflect ClickUp API v2 response shapes based on official documentation
- **FR-020**: README feature table MUST link each API capability to its example file AND its official ClickUp documentation page
- **FR-021**: System MUST implement 30-second HTTP request timeout for all API calls to handle network interruptions
- **FR-022**: System MUST provide configurable debug logging (enabled via DEBUG environment variable) that logs request/response details with automatic API token redaction

### Key Entities

- **User**: Represents authenticated ClickUp user (id, username, email, profile info)
- **Workspace (Team)**: Top-level organizational container (id, name, members)
- **Space**: Organizational unit within workspace (id, name, features, statuses)
- **Folder**: Optional grouping within space (id, name, lists)
- **List**: Container for tasks (id, name, folder_id, statuses)
- **Task**: Core work item (id, name, description, status, priority, due_date, assignees, tags, custom_fields, parent_id for subtasks)
- **CustomField**: Configurable field definition (id, name, type, type_config, list_id)
- **Webhook**: Event notification endpoint (id, endpoint, events, secret, status)
- **Comment**: Task discussion item (id, comment_text, user, date)
- **TimeEntry**: Time tracking record (id, duration, description, task_id, user)
- **Goal**: Objective tracking (id, name, due_date, description, targets)
- **View**: Saved task view configuration (id, name, type, settings)
- **Member**: Team member representation (id, user, role, permissions)
- **Checklist**: Task sub-item list (id, name, items[])
- **Dependency**: Task relationship (depends_on, dependency_of)
- **Attachment**: File upload (id, url, filename, size)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Reference code covers all API operations listed in FR-002 (15 distinct operation categories: authentication, workspaces, spaces, folders, lists, tasks, dependencies, checklists, tags, custom fields, webhooks, comments, time tracking, goals, views, members) - implemented as 39 client methods
- **SC-002**: Every example script (25 total) runs successfully against a real ClickUp workspace when CLICKUP_API_TOKEN is provided
- **SC-003**: Unit test suite (54 tests in 13 suites) achieves meaningful code coverage and passes in under 10 seconds
- **SC-004**: Integration test suite (16 tests in 5 suites) completes full test run including cleanup in under 5 minutes when CLICKUP_API_TOKEN is provided, or skips gracefully when unset
- **SC-005**: README feature table provides direct navigation to both example code and official docs for each capability in under 3 clicks
- **SC-006**: CI pipeline completes lint + typecheck + unit tests in under 2 minutes on pull requests
- **SC-007**: Code indexing systems can extract API operation → documentation URL mappings from 100% of example files via JSDoc parsing
- **SC-008**: Zero API tokens or secrets committed to repository (verified by secret scanning)
- **SC-009**: Rate limit handling successfully retries up to 5 times and completes operations when encountering HTTP 429 (tested with controlled scenarios)
- **SC-010**: Webhook signature verification rejects 100% of payloads with invalid signatures (tested with malformed signatures)
- **SC-011**: All API requests timeout after 30 seconds when connection is unresponsive
- **SC-012**: Debug logging (when enabled) never exposes API tokens in logs (verified by log inspection tests)

## Assumptions

- Target audience has basic TypeScript and Node.js knowledge
- Users have access to a ClickUp workspace where they can create test data (or will use the integration test suite's dedicated space)
- ClickUp API v2 remains stable during development (breaking API changes would require spec updates)
- Users understand REST API concepts (HTTP methods, status codes, headers)
- GitHub Actions is the target CI/CD platform (other platforms would need workflow adaptation)
- Users can obtain a ClickUp API token following official documentation (token acquisition is out of scope)
- The project will be hosted on GitHub (for GitHub Actions, repository secrets, PR workflows)
- Examples prioritize clarity and education over production-ready error handling in all cases
- Type definitions may require updates as ClickUp adds new API features (maintenance expected)
- Integration tests assume a stable internet connection to ClickUp API
- Webhook testing assumes users can expose a public endpoint (or use tools like ngrok for local testing)
