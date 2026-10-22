# Quickstart: ClickUp API v2 Kitchen Sink

**Date**: 2026-10-22

## Overview

This guide provides step-by-step instructions for running the ClickUp API v2 kitchen sink reference implementation examples and tests. Use this to validate that the implementation works correctly and understand how to use it.

---

## Prerequisites

### 1. ClickUp API Token

You need a ClickUp personal API token. To obtain one:

1. Go to https://app.clickup.com/settings/apps
2. Scroll to "API Token"
3. Click "Generate" (or "Regenerate" if you already have one)
4. Copy the token (starts with `pk_`)

**⚠️ Security**: Never commit your API token to source control. Always use environment variables.

### 2. System Requirements

- **Node.js**: 20.x or later
- **npm**: 9.x or later (comes with Node.js)
- **Operating System**: macOS, Linux, or Windows
- **Internet**: Stable connection to ClickUp API (https://api.clickup.com)

### 3. ClickUp Workspace Access

You need access to a ClickUp workspace where you can:
- Create and delete spaces (for integration tests)
- Create and delete lists
- Create and delete tasks
- Register webhooks (requires workspace admin role)

**Tip**: Use a personal/testing workspace, not your production workspace.

---

## Installation

### Clone and Install Dependencies

```bash
# Clone the repository (replace with actual repo URL)
git clone https://github.com/your-org/clickup-api-kitchen-sink.git
cd clickup-api-kitchen-sink

# Install dependencies
npm install

# Verify installation
npm run typecheck
npm run lint
```

**Expected Output**:
```
✓ Type checking passed
✓ Linting passed with 0 warnings
```

---

## Configuration

### Set API Token

**Option 1: Environment Variable (Recommended)**

```bash
export CLICKUP_API_TOKEN="pk_your_token_here"
```

To persist across sessions, add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
echo 'export CLICKUP_API_TOKEN="pk_your_token_here"' >> ~/.zshrc
source ~/.zshrc
```

**Option 2: .env File (Local Development Only)**

Create a `.env` file (already in `.gitignore`):

```bash
echo "CLICKUP_API_TOKEN=pk_your_token_here" > .env
```

**⚠️ Warning**: Never commit `.env` files. They are excluded by `.gitignore` for security.

### Verify Token

Run the authentication example to verify your token works:

```bash
npx ts-node examples/01-auth-user.ts
```

**Expected Output**:
```
✅ Success!

User: John Doe (john@example.com)
ID: 12345

Full Response:
{
  "id": 12345,
  "username": "John Doe",
  "email": "john@example.com",
  ...
}
```

If you see `❌ Authentication failed`, verify your token is correct.

---

## Running Examples

### Basic Examples (No Prerequisites)

These examples only need a valid API token:

```bash
# Get authenticated user info
npx ts-node examples/01-auth-user.ts

# List your workspaces
npx ts-node examples/02-workspaces.ts

# List spaces in first workspace (automatic)
npx ts-node examples/03-spaces.ts
```

### Examples Requiring IDs

Some examples need workspace/space/list IDs. Get these from earlier examples:

#### Step 1: Get Workspace ID

```bash
npx ts-node examples/02-workspaces.ts
```

Copy a workspace ID from the output (looks like `"12345"`).

#### Step 2: Get List ID

```bash
# Replace WORKSPACE_ID with your actual workspace ID
npx ts-node examples/05-lists.ts WORKSPACE_ID
```

Copy a list ID from the output (looks like `"901234567890"`).

#### Step 3: Run Task Examples

```bash
# Replace LIST_ID with your actual list ID
npx ts-node examples/06-task-crud.ts LIST_ID
npx ts-node examples/07-subtasks.ts LIST_ID
npx ts-node examples/13-custom-fields.ts LIST_ID
```

### Advanced Examples

#### Rate Limiting Demo

Demonstrates automatic retry logic:

```bash
npx ts-node examples/23-rate-limiting.ts
```

**What it does**:
1. Makes API calls in rapid succession
2. Triggers rate limiting (HTTP 429)
3. Automatically retries with exponential backoff
4. Shows retry attempts in console

#### Pagination Demo

Shows cursor-based pagination:

```bash
npx ts-node examples/24-pagination.ts LIST_ID
```

**What it does**:
1. Fetches first page of tasks (100 max)
2. Follows cursor to next page
3. Continues until all tasks retrieved
4. Shows total task count

#### Webhook Examples

Webhooks require a publicly accessible endpoint. Options:

**Option 1: ngrok (Recommended for Testing)**

```bash
# Terminal 1: Start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)

# Terminal 2: Set endpoint and create webhook
export WEBHOOK_ENDPOINT="https://abc123.ngrok.io/webhook"
npx ts-node examples/16-webhooks-create.ts WORKSPACE_ID

# Terminal 3: Run webhook listener
npx ts-node examples/19-signature-verify.ts
```

**Option 2: Public Server**

Deploy webhook listener to a public server and use that URL.

#### End-to-End Example

Comprehensive workflow demonstrating all features:

```bash
npx ts-node examples/99-end-to-end.ts
```

**What it does**:
1. Authenticates and lists workspaces
2. Creates test space and list
3. Creates task with custom fields
4. Adds subtask, checklist, tags
5. Registers webhook
6. Updates task (triggers webhook)
7. Cleans up all resources

**Duration**: ~20-30 seconds

---

## Running Tests

### Unit Tests (No API Token Required)

Unit tests use mocked HTTP responses and run entirely offline:

```bash
# Run all unit tests
npm test

# Run specific test file
npm test src/client/http.test.ts

# Run with coverage
npm run test:coverage
```

**Expected Output**:
```
 ✓ src/client/http.test.ts (15 tests)
 ✓ src/client/rate-limiter.test.ts (8 tests)
 ✓ src/webhooks/signature-verification.test.ts (6 tests)

Test Files  12 passed (12)
     Tests  89 passed (89)
   Duration  2.34s

Coverage Summary:
  Statements   : 92.45% (1234/1335)
  Branches     : 87.23% (456/523)
  Functions    : 94.12% (128/136)
  Lines        : 93.01% (1198/1289)
```

**Success Criteria**: All tests pass, coverage ≥ 80%

### Integration Tests (API Token Required)

Integration tests run against the real ClickUp API and require a valid token:

```bash
# Set API token
export CLICKUP_API_TOKEN="pk_your_token_here"

# Run integration tests
npm run test:integration
```

**What happens**:
1. Creates dedicated test space: `CLICKUP_KITCHEN_SINK_TEST_<timestamp>`
2. Creates test list inside space
3. Runs all integration test suites
4. Cleans up all created resources (even on failure)

**Duration**: ~3-5 minutes

**Expected Output**:
```
 ✓ tests/integration/auth.integration.test.ts (3 tests)
 ✓ tests/integration/tasks.integration.test.ts (12 tests)
 ✓ tests/integration/webhooks.integration.test.ts (5 tests)

Integration Tests  25 passed (25)
Duration  4m 12s

✅ Cleanup successful: All test resources deleted
```

**⚠️ Important**:
- Integration tests create real resources in your ClickUp workspace
- Resources are automatically cleaned up, but check manually if tests fail unexpectedly
- Only run when needed (not on every code change)

### Skip Integration Tests Gracefully

If `CLICKUP_API_TOKEN` is not set, integration tests skip automatically:

```bash
unset CLICKUP_API_TOKEN
npm run test:integration
```

**Output**:
```
⊗ tests/integration/auth.integration.test.ts (skipped)
⊗ tests/integration/tasks.integration.test.ts (skipped)

Integration Tests  0 passed (0 skipped)

ℹ Skipped: CLICKUP_API_TOKEN not set
```

---

## CI/CD Pipeline

### GitHub Actions Workflows

#### Pull Request Checks (ci.yml)

Runs automatically on every pull request:

1. **Lint**: Check code style
2. **Type Check**: Verify TypeScript types
3. **Unit Tests**: Run all unit tests with coverage

**Duration**: ~2 minutes

**View Results**: Check the "Checks" tab on your PR

#### Integration Tests (integration.yml)

Runs manually via workflow_dispatch:

1. Go to repository → Actions → "Integration Tests"
2. Click "Run workflow"
3. Select branch
4. Click "Run workflow" button

**Duration**: ~5 minutes

**Requirements**: Repository must have `CLICKUP_API_TOKEN` secret configured

### Local CI Simulation

Run the same checks CI runs:

```bash
# Full CI check (what runs on PRs)
npm run ci

# This runs:
# - npm run lint
# - npm run typecheck
# - npm test
```

**Expected Output**:
```
✓ Lint passed
✓ Type check passed
✓ Tests passed (89/89)

CI checks: ALL PASSED ✅
```

---

## Debugging

### Enable Debug Logging

See detailed HTTP requests, retries, and API interactions:

```bash
# Enable all debug logs
DEBUG=clickup:* npx ts-node examples/01-auth-user.ts

# Enable specific namespace
DEBUG=clickup:http npx ts-node examples/06-task-crud.ts LIST_ID
DEBUG=clickup:retry npx ts-node examples/23-rate-limiting.ts
DEBUG=clickup:pagination npx ts-node examples/24-pagination.ts
```

**Example Output**:
```
clickup:http GET /user +0ms
clickup:http Request Headers: {"Authorization":"[REDACTED]",...} +2ms
clickup:http Response 200: {"id":12345,...} +145ms
```

**Security**: API tokens are automatically redacted in logs (`[REDACTED]`)

### Common Issues

#### "Authentication failed: Invalid API token"

**Problem**: Token is incorrect or expired

**Solution**:
1. Verify token: `echo $CLICKUP_API_TOKEN`
2. Regenerate token at https://app.clickup.com/settings/apps
3. Update environment variable

#### "Permission denied: Insufficient access"

**Problem**: Your account doesn't have required permissions

**Solution**:
- Workspace operations require workspace member access
- Webhook creation requires workspace admin role
- Check your role in workspace settings

#### "Resource not found"

**Problem**: Using invalid workspace/space/list/task ID

**Solution**:
1. Verify IDs by listing resources first (e.g., run `examples/02-workspaces.ts`)
2. Check for typos in IDs
3. Ensure resource hasn't been deleted

#### "Rate limit exceeded"

**Problem**: Too many requests in short time

**Solution**:
- Client automatically retries (up to 5 attempts)
- If all retries fail, wait 60 seconds before trying again
- Use pagination example to understand rate-friendly patterns

#### TypeScript Errors: `Cannot find module`

**Problem**: Dependencies not installed

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Validation Scenarios

### Scenario 1: End-to-End Task Creation

**Goal**: Verify complete task creation workflow works

**Steps**:
1. Get workspace ID: `npx ts-node examples/02-workspaces.ts`
2. Get list ID: `npx ts-node examples/05-lists.ts <workspace_id>`
3. Create task: `npx ts-node examples/06-task-crud.ts <list_id>`
4. Verify task appears in ClickUp web app

**Expected Result**: Task visible in web app with all properties set

### Scenario 2: Custom Fields

**Goal**: Verify custom field values are set correctly

**Steps**:
1. Create list with custom fields in ClickUp web app
2. Note field IDs: `npx ts-node examples/13-custom-fields.ts <list_id>`
3. Create task with field values
4. Verify values in web app

**Expected Result**: Task shows custom field values correctly

### Scenario 3: Webhook Delivery

**Goal**: Verify webhook signature verification works

**Prerequisites**: ngrok or public webhook endpoint

**Steps**:
1. Start ngrok: `ngrok http 3000`
2. Create webhook: `npx ts-node examples/16-webhooks-create.ts <workspace_id>`
3. Start listener: `npx ts-node examples/19-signature-verify.ts`
4. Update task in web app
5. Verify webhook received with valid signature

**Expected Result**: Listener logs `✅ Valid signature` and event details

### Scenario 4: Pagination

**Goal**: Verify pagination handles large result sets

**Steps**:
1. Create list with 200+ tasks (or use existing large list)
2. Run pagination example: `npx ts-node examples/24-pagination.ts <list_id>`
3. Verify all tasks retrieved without duplicates

**Expected Result**: Shows correct total count, no missing/duplicate tasks

### Scenario 5: Rate Limit Handling

**Goal**: Verify automatic retry works

**Steps**:
1. Run rate limiting example: `npx ts-node examples/23-rate-limiting.ts`
2. Observe retry logs
3. Verify operations complete successfully

**Expected Result**: Some requests trigger 429, but all eventually succeed

---

## Next Steps

After completing this quickstart:

1. **Explore Examples**: Review all [25 example scripts](../examples/) to learn patterns
2. **Read Contracts**: Study [client-api.md](./contracts/client-api.md) for API details
3. **Review Data Model**: See [data-model.md](./data-model.md) for type definitions
4. **Build Integration**: Use client library in your own application
5. **Contribute**: Report issues or submit improvements

---

## Summary

This quickstart demonstrated:
- ✅ Installation and configuration
- ✅ Running basic examples (auth, workspaces, tasks)
- ✅ Running advanced examples (webhooks, pagination, rate limiting)
- ✅ Running unit tests (offline, mocked)
- ✅ Running integration tests (live API)
- ✅ Debugging with DEBUG logs
- ✅ Validation scenarios for key workflows

**Key Takeaways**:
- Always use `CLICKUP_API_TOKEN` environment variable
- Unit tests run offline, integration tests need real token
- Examples are self-contained and well-documented
- Debug logging automatically redacts sensitive data
- Rate limiting and pagination are handled automatically

**API Coverage**: This implementation covers 90%+ of ClickUp API v2 endpoints as specified in [FR-002](./spec.md#requirements).
