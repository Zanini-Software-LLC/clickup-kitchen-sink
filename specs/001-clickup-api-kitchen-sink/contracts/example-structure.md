# Example Script Structure Contract

**Date**: 2026-10-22

## Overview

This document defines the standard structure and patterns for all example scripts in the ClickUp API v2 kitchen sink reference implementation. Consistent structure makes examples easier to learn from and enables AI agents to extract patterns effectively.

---

## Standard Example Template

Every example script MUST follow this structure:

```typescript
/**
 * Example: [Operation Name]
 * 
 * Demonstrates: [What this example teaches]
 * 
 * Prerequisites:
 * - [Any setup required, e.g., "A workspace with at least one list"]
 * 
 * API Reference: https://developer.clickup.com/reference/[endpoint-slug]
 * 
 * @see ../src/client/[relevant-module].ts for implementation details
 */

import { ClickUpClient } from '../src/client';
// Other imports as needed

/**
 * Main function implementing the example.
 * Kept as separate async function for clean error handling.
 */
async function main() {
  // SECTION 1: Configuration Validation
  // ====================================
  // Validate required environment variables and prerequisites
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    console.error('❌ Error: CLICKUP_API_TOKEN environment variable is required');
    console.error('');
    console.error('To get your API token:');
    console.error('1. Go to https://app.clickup.com/settings/apps');
    console.error('2. Click "Generate" under "API Token"');
    console.error('3. Set the token: export CLICKUP_API_TOKEN="your_token_here"');
    process.exit(1);
  }

  // Validate any other prerequisites (workspace ID, list ID, etc.)
  // If example requires user input, check for command-line args

  // SECTION 2: Client Initialization
  // =================================
  const client = new ClickUpClient(token);

  try {
    // SECTION 3: API Operation(s)
    // ============================
    // Perform the primary operation this example demonstrates
    // Include inline comments explaining each step

    console.log('📋 [Action description]...');
    const result = await client.someOperation(/* params */);

    // If multi-step example, break into clear phases:
    // Step 1: ...
    // Step 2: ...
    // Step 3: ...

    // SECTION 4: Result Display
    // ==========================
    // Show results in both human-readable and machine-readable formats

    console.log('✅ Success!');
    console.log('');
    
    // Human-readable summary
    console.log(`Created: ${result.name} (ID: ${result.id})`);
    
    // Full JSON output for inspection
    console.log('');
    console.log('Full Response:');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    // SECTION 5: Error Handling
    // ==========================
    // Provide actionable error messages based on error type

    if (error instanceof ClickUpAPIError) {
      if (error.statusCode === 401) {
        console.error('❌ Authentication failed: Invalid API token');
        console.error('Please check your CLICKUP_API_TOKEN value');
      } else if (error.statusCode === 403) {
        console.error('❌ Permission denied: You do not have access to this resource');
      } else if (error.statusCode === 404) {
        console.error('❌ Resource not found: The requested item does not exist');
      } else if (error.statusCode === 429) {
        console.error('❌ Rate limit exceeded: Too many requests');
        console.error('The client should have automatically retried. This means all retries failed.');
      } else {
        console.error(`❌ API Error (${error.statusCode}):`, error.message);
      }
    } else {
      console.error('❌ Unexpected error:', error.message);
    }
    
    // Always exit with non-zero code on error
    process.exit(1);
  }
}

// Entry point: run main and handle any uncaught errors
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
```

---

## File Naming Convention

Examples MUST be numbered sequentially with descriptive names:

```
examples/
├── 01-auth-user.ts          # Authentication (P1)
├── 02-workspaces.ts         # List workspaces (P1)
├── 03-spaces.ts             # Space operations (P1)
├── 04-folders.ts            # Folder operations (P1)
├── 05-lists.ts              # List operations (P1)
├── 06-task-crud.ts          # Task CRUD (P1)
├── 07-subtasks.ts           # Subtasks (P2)
├── 08-dependencies.ts       # Task dependencies (P2)
├── 09-checklists.ts         # Checklists (P2)
├── 10-tags.ts               # Tags (P2)
├── 11-assignees.ts          # Assignees (P2)
├── 12-attachments.ts        # File attachments (P2)
├── 13-custom-fields.ts      # Custom field values (P2)
├── 14-comments.ts           # Comments (P2)
├── 15-time-tracking.ts      # Time entries (P2)
├── 16-webhooks-create.ts    # Create webhook (P2)
├── 17-webhooks-list.ts      # List webhooks (P2)
├── 18-webhooks-delete.ts    # Delete webhook (P2)
├── 19-signature-verify.ts   # Webhook signature verification (P2)
├── 20-goals.ts              # Goals (P2)
├── 21-views.ts              # Views (P2)
├── 22-members.ts            # Team members (P2)
├── 23-rate-limiting.ts      # Rate limit handling demo (P2)
├── 24-pagination.ts         # Pagination demo (P2)
└── 99-end-to-end.ts         # Complete workflow (P3)
```

**Numbering Strategy**:
- `01-09`: Core operations (authentication, hierarchy navigation, basic CRUD)
- `10-22`: Advanced features (subtasks, dependencies, webhooks, custom fields)
- `23-24`: Infrastructure features (rate limiting, pagination)
- `99`: End-to-end comprehensive example

---

## JSDoc Header Requirements

Every example MUST include a comprehensive JSDoc header:

```typescript
/**
 * Example: [Operation Name]
 * 
 * Demonstrates: [What patterns/techniques this shows]
 * 
 * Prerequisites:
 * - [Requirement 1, e.g., "A ClickUp workspace with at least one space"]
 * - [Requirement 2, e.g., "A list ID to create tasks in"]
 * 
 * Usage:
 * ```bash
 * export CLICKUP_API_TOKEN="your_token_here"
 * npx ts-node examples/[filename].ts [args if needed]
 * ```
 * 
 * API Reference: https://developer.clickup.com/reference/[endpoint-slug]
 * 
 * @see ../src/client/[module].ts for client implementation
 * @see ../tests/unit/[module].test.ts for unit tests
 */
```

**Required Elements**:
1. **Operation Name**: Clear, concise description (e.g., "Create Task with Custom Fields")
2. **Demonstrates**: What the example teaches (e.g., "Setting custom field values on task creation")
3. **Prerequisites**: What the user needs before running (workspace, list IDs, etc.)
4. **Usage**: Exact command to run the example
5. **API Reference**: Direct link to ClickUp API documentation
6. **See Also**: Links to implementation and tests

---

## Configuration Validation Pattern

All examples MUST validate `CLICKUP_API_TOKEN` with a helpful error message:

```typescript
const token = process.env.CLICKUP_API_TOKEN;
if (!token) {
  console.error('❌ Error: CLICKUP_API_TOKEN environment variable is required');
  console.error('');
  console.error('To get your API token:');
  console.error('1. Go to https://app.clickup.com/settings/apps');
  console.error('2. Click "Generate" under "API Token"');
  console.error('3. Set the token: export CLICKUP_API_TOKEN="your_token_here"');
  process.exit(1);
}
```

**For examples requiring additional inputs** (workspace ID, list ID, etc.):

```typescript
// Option 1: Command-line argument
const listId = process.argv[2];
if (!listId) {
  console.error('❌ Error: List ID is required');
  console.error('');
  console.error('Usage:');
  console.error('  npx ts-node examples/06-task-crud.ts <list_id>');
  console.error('');
  console.error('To find your list ID:');
  console.error('1. Run: npx ts-node examples/05-lists.ts');
  console.error('2. Copy a list ID from the output');
  process.exit(1);
}

// Option 2: Environment variable with fallback
const listId = process.env.TEST_LIST_ID;
if (!listId) {
  console.error('❌ Error: TEST_LIST_ID environment variable is required');
  console.error('Set it to a list ID where test tasks can be created');
  process.exit(1);
}
```

---

## Output Format Pattern

Examples MUST provide both human-readable and machine-readable output:

### Success Output

```typescript
console.log('✅ Success!');
console.log('');

// Human-readable summary (key information only)
console.log(`Task created: "${task.name}"`);
console.log(`ID: ${task.id}`);
console.log(`URL: ${task.url}`);
console.log(`Status: ${task.status.status}`);

// Machine-readable full output (for inspection/debugging)
console.log('');
console.log('Full Response:');
console.log(JSON.stringify(task, null, 2));
```

### Progress Indicators

For multi-step examples:

```typescript
console.log('📋 Creating task...');
const task = await client.createTask(listId, { name: 'Test Task' });
console.log('✅ Task created');

console.log('');
console.log('🔗 Adding dependency...');
await client.addDependency(task.id, dependsOnTaskId);
console.log('✅ Dependency added');

console.log('');
console.log('📎 Creating webhook...');
const webhook = await client.createWebhook(workspaceId, webhookData);
console.log('✅ Webhook registered');
```

---

## Error Handling Pattern

All examples MUST handle errors with actionable messages:

```typescript
catch (error) {
  if (error instanceof ClickUpAPIError) {
    switch (error.statusCode) {
      case 401:
        console.error('❌ Authentication failed: Invalid API token');
        console.error('Please verify your CLICKUP_API_TOKEN value');
        break;
      
      case 403:
        console.error('❌ Permission denied: Insufficient access to this resource');
        console.error('Make sure your API token has the required permissions');
        break;
      
      case 404:
        console.error('❌ Resource not found');
        console.error('The requested item does not exist or has been deleted');
        break;
      
      case 429:
        console.error('❌ Rate limit exceeded');
        console.error('All retry attempts exhausted. Please wait before trying again.');
        break;
      
      default:
        console.error(`❌ API Error (${error.statusCode}):`, error.message);
        if (error.errorCode) {
          console.error(`Error Code: ${error.errorCode}`);
        }
    }
  } else {
    console.error('❌ Unexpected error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
  
  process.exit(1);
}
```

---

## Inline Comments Pattern

Comments MUST explain **why** and **what**, not just **how**:

### Good Comments

```typescript
// ClickUp requires Unix timestamps in milliseconds, not seconds
const dueDate = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days from now

// Custom field values must match the field type exactly
// Drop-down fields require the option ID, not the option name
const customFields = [
  {
    id: priorityFieldId,
    value: dropdownOptionId, // Not the option name!
  },
];

// Webhook signatures use HMAC-SHA256 with the secret as the key
// This prevents webhook spoofing attacks
const isValid = verifyWebhookSignature(payload, signature, secret);
```

### Bad Comments (Too Obvious)

```typescript
// Create task
const task = await client.createTask(listId, taskData);

// Log result
console.log(task);

// Increment counter
count++;
```

---

## Self-Contained Example Contract

Every example MUST be runnable independently:

1. **No shared state**: Each example creates its own resources
2. **No assumptions**: Don't assume workspace IDs, list IDs, etc. (require as input or fetch dynamically)
3. **Clean imports**: Only import what's needed
4. **Clear entry point**: Always use `main()` pattern with `.catch()` handler
5. **Graceful exit**: Use `process.exit(0)` for success, `process.exit(1)` for error

---

## End-to-End Example (99-end-to-end.ts)

The comprehensive example MUST demonstrate a complete workflow:

1. Authenticate and get user info
2. List workspaces and select one
3. List spaces and select/create test space
4. List lists and select/create test list
5. Get custom fields for the list
6. Create task with custom field values
7. Add subtask
8. Add checklist
9. Register webhook for task updates
10. Update task (trigger webhook)
11. Verify webhook received
12. Clean up (delete task, webhook)

**Contract**:
- Show realistic integration patterns
- Demonstrate error handling at each step
- Include cleanup even if errors occur
- Provide clear progress indicators
- Total runtime: <30 seconds (excluding webhook wait)

---

## Example Metadata for README

Each example provides this structure for README table generation:

```typescript
// Metadata (embedded in JSDoc for extraction)
/**
 * @metadata
 * - Category: Authentication
 * - Priority: P1
 * - API Endpoint: GET /user
 * - Docs: https://developer.clickup.com/reference/getauthorizeduser
 */
```

Extracted into README table:

| Example | Category | Description | API Docs |
|---------|----------|-------------|----------|
| [01-auth-user.ts](examples/01-auth-user.ts) | Authentication | Get authenticated user information | [API Ref](https://developer.clickup.com/reference/getauthorizeduser) |

---

## Testing Contract for Examples

While examples are not unit tested, they SHOULD:

1. Be executable in CI (with mocked API or skip when CLICKUP_API_TOKEN unset)
2. Validate their own preconditions (token presence, valid IDs)
3. Provide clear error messages when preconditions fail
4. Exit with correct status codes (0 = success, 1 = error)

---

## Summary

All example scripts MUST follow this contract to ensure:
- ✅ Consistent structure for learning
- ✅ Self-contained, runnable examples
- ✅ Clear JSDoc with API documentation links
- ✅ Actionable error messages
- ✅ Both human and machine-readable output
- ✅ Clean entry point and error handling
- ✅ Inline comments explaining **why** and **what**

This consistency enables:
- AI agents to extract patterns reliably
- Developers to find examples quickly
- Code indexing systems to map operations → docs
- Automated README generation from metadata
