# Research: ClickUp API v2 Kitchen Sink Implementation

**Date**: 2026-10-22

## Overview

This document consolidates research findings and technology decisions for building the ClickUp API v2 reference implementation. All "NEEDS CLARIFICATION" items from Technical Context have been resolved.

---

## Decision 1: HTTP Client Library

**Decision**: Use `axios` as the HTTP client library

**Rationale**:
- Industry-standard HTTP client for Node.js with TypeScript support
- Built-in interceptor support for adding authentication headers, logging, rate limit detection
- Native timeout configuration (required for 30-second timeout in FR-021)
- Request/response transformation support for consistent error handling
- Wide adoption means better community support and AI training data
- Better suited for reference/educational code than lower-level `fetch` or `node:http`

**Alternatives Considered**:
- **native `fetch`** (Node 18+): Rejected because requires manual retry/timeout wrappers, less educational clarity
- **`got`**: Rejected because less commonly used in enterprise, fewer axios-to-got migration examples
- **`node-fetch`**: Rejected in favor of native fetch or axios for better modern Node.js alignment

---

## Decision 2: HTTP Mocking for Unit Tests

**Decision**: Use `nock` for HTTP request mocking

**Rationale**:
- Mature, widely-adopted library specifically designed for HTTP mocking in Node.js
- Works seamlessly with axios (intercepts at the HTTP level, not client level)
- Declarative API makes tests readable: `nock('https://api.clickup.com').get('/user').reply(200, { ... })`
- Supports recording/playback for future test enhancement
- Explicit assertion capabilities (verify all mocks were called)
- Better for reference code: demonstrates common Node.js testing pattern

**Alternatives Considered**:
- **`msw` (Mock Service Worker)**: Rejected because primarily designed for browser environments, adds unnecessary complexity for Node.js-only tests
- **Manual mocking with `jest.mock()`**: Rejected because less portable (we're using vitest) and requires deeper mocking knowledge
- **`axios-mock-adapter`**: Rejected because couples tests to axios implementation details rather than HTTP contract

---

## Decision 3: Rate Limit Retry Strategy Pattern

**Decision**: Implement retry logic as axios interceptor with exponential backoff (1s, 2s, 4s, 8s, 16s) respecting `Retry-After` header

**Rationale**:
- Axios interceptors provide centralized response handling for all requests
- ClickUp API returns `Retry-After` header with 429 responses (documented in API reference)
- Exponential backoff prevents thundering herd problem
- 5 attempts with these delays = ~31s total wait (reasonable user tolerance)
- Interceptor pattern is reusable and testable in isolation
- Makes rate limit handling transparent to example code (automatic)

**Alternatives Considered**:
- **Per-request retry wrapper**: Rejected because requires every API call to use wrapper, not transparent
- **Fixed delay retry**: Rejected because doesn't respect API's Retry-After guidance, inefficient
- **Library like `axios-retry`**: Considered but rejected to keep implementation explicit and educational

**Implementation Pattern**:
```typescript
// Pseudocode for reference
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    if (error.response?.status === 429 && config._retryCount < 5) {
      const retryAfter = parseInt(error.response.headers['retry-after']) || Math.pow(2, config._retryCount);
      config._retryCount = (config._retryCount || 0) + 1;
      await sleep(retryAfter * 1000);
      return axiosInstance(config);
    }
    throw error;
  }
);
```

---

## Decision 4: Pagination Pattern

**Decision**: Implement pagination helper function that yields results from cursor-based pagination

**Rationale**:
- ClickUp API v2 uses cursor-based pagination (not offset-based)
- Response includes `cursor` field when more results available
- Generator function pattern (`async function* paginate()`) provides clean iteration
- Allows examples to use `for await (const page of paginate(...))` syntax
- Helper function centralizes pagination logic, making it reusable and testable

**Alternatives Considered**:
- **Manual pagination in examples**: Rejected because duplicates logic, error-prone, not educational
- **Load-all helper**: Rejected because may cause memory issues with large datasets
- **Callback-based pagination**: Rejected because less modern than async generators

**Implementation Pattern**:
```typescript
async function* paginateTasks(listId: string) {
  let cursor: string | null = null;
  do {
    const response = await client.get(`/list/${listId}/task`, { params: { cursor } });
    yield response.data.tasks;
    cursor = response.data.cursor || null;
  } while (cursor);
}
```

---

## Decision 5: Webhook Signature Verification

**Decision**: Implement HMAC-SHA256 signature verification using Node.js `crypto` module

**Rationale**:
- ClickUp webhook signature uses HMAC-SHA256 with webhook secret as key
- Node.js `crypto.createHmac('sha256', secret)` is built-in, no dependencies
- Security-critical: must demonstrate proper verification to prevent spoofed webhooks
- Pattern is reusable for other webhook providers (GitHub, Stripe, etc.)

**Alternatives Considered**:
- **Library like `svix`**: Rejected because adds dependency for single crypto operation
- **Manual string comparison**: Rejected because timing-attack vulnerable

**Implementation Pattern**:
```typescript
import crypto from 'crypto';

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

---

## Decision 6: Debug Logging with Token Redaction

**Decision**: Use `debug` package with custom formatter that redacts `Authorization` headers and any field containing "token" or "secret"

**Rationale**:
- `debug` package is Node.js standard for conditional logging (DEBUG env var)
- Namespace pattern (`debug('clickup:http')`, `debug('clickup:retry')`) allows granular control
- Custom formatter intercepts all log messages to redact sensitive data before output
- Redaction pattern: replace token values with `[REDACTED]`
- Educational: demonstrates secure logging practices

**Alternatives Considered**:
- **`winston` or `pino`**: Rejected because overkill for reference implementation, adds complexity
- **No logging**: Rejected because debugging API issues requires visibility
- **Manual redaction per log call**: Rejected because error-prone, easy to forget

**Redaction Rules**:
- Any header named `Authorization` → `Authorization: [REDACTED]`
- Any object key containing `token`, `secret`, `password`, `key` (case-insensitive) → value replaced with `[REDACTED]`
- Applied automatically before log message reaches stdout

---

## Decision 7: TypeScript Type Definitions Strategy

**Decision**: Hand-write TypeScript interfaces mirroring ClickUp API v2 response shapes from official documentation

**Rationale**:
- ClickUp does not provide official TypeScript SDK or type definitions
- Reference implementation benefits from explicit, well-documented types
- Hand-written types allow JSDoc comments linking to specific API documentation pages
- Easier to maintain partial types (only fields used in examples) vs. complete coverage
- Educational: shows proper type modeling for external APIs

**Alternatives Considered**:
- **Generate from OpenAPI spec**: Rejected because ClickUp doesn't publish OpenAPI schema
- **`any` types**: Rejected because defeats purpose of TypeScript reference code
- **Third-party type library**: Rejected because none exist with adequate coverage/maintenance

**Type Coverage Strategy**:
1. Start with core entities (User, Workspace, Space, Folder, List, Task)
2. Add properties as examples need them (incremental)
3. Mark optional properties correctly based on API docs
4. Include union types for enums (status, priority, custom field types)

---

## Decision 8: Testing Strategy for Live Integration Tests

**Decision**: Integration tests create a dedicated test space with consistent name prefix, run operations, then delete all created resources in reverse order

**Rationale**:
- Prevents pollution of user's workspace with test data
- Consistent naming (`CLICKUP_KITCHEN_SINK_TEST_*`) makes identification easy
- Reverse-order deletion ensures child resources (tasks) deleted before parents (lists)
- Dedicated cleanup suite runs even if tests fail (afterAll hooks)
- Skip gracefully when CLICKUP_API_TOKEN unset (no partial runs)

**Alternatives Considered**:
- **Use user's existing space**: Rejected because creates clutter, risky data mixing
- **No cleanup**: Rejected because violates user workspace cleanliness
- **Manual cleanup script**: Rejected because users may forget to run it

**Cleanup Order**:
1. Delete all created tasks
2. Delete all created lists
3. Delete all created folders
4. Delete all created spaces (if test created dedicated space)
5. Delete all created webhooks

---

## Decision 9: Example Script Structure Pattern

**Decision**: Each example script follows consistent structure: imports → config validation → operation → output → error handling

**Rationale**:
- Consistency makes examples easier to learn from
- Config validation upfront (check CLICKUP_API_TOKEN) prevents cryptic errors
- Clear operation section shows API usage
- Output formatting shows results (JSON + human-readable summary)
- Error handling demonstrates proper error messaging

**Standard Template**:
```typescript
/**
 * Example: [Operation Description]
 * 
 * Demonstrates: [What this shows]
 * 
 * API Reference: https://developer.clickup.com/reference/[endpoint]
 */

import { ClickUpClient } from '../src/client';

async function main() {
  // 1. Validate configuration
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    console.error('❌ CLICKUP_API_TOKEN environment variable is required');
    process.exit(1);
  }

  // 2. Initialize client
  const client = new ClickUpClient(token);

  try {
    // 3. Perform operation
    const result = await client.someOperation();

    // 4. Display results
    console.log('✅ Success!');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    // 5. Handle errors
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
```

---

## Decision 10: CI/CD Strategy

**Decision**: Two GitHub Actions workflows:
1. **ci.yml** (runs on PRs): lint → typecheck → unit tests
2. **integration.yml** (manual workflow_dispatch): integration tests using secret

**Rationale**:
- PR checks run fast (<2 min) without API token requirement
- Integration tests isolated to manual runs (avoid rate limit exhaustion)
- Repository secret `CLICKUP_API_TOKEN` provides secure token injection
- Separate workflows allow different trigger conditions and permissions

**Alternatives Considered**:
- **Single workflow with conditional integration tests**: Rejected because makes PR check timing unpredictable
- **Integration tests on every push**: Rejected because wastes API quota, risk of rate limiting
- **No CI**: Rejected because spec requires GitHub Actions (FR-010)

---

## Summary of Resolved Clarifications

| Original "NEEDS CLARIFICATION" | Resolution |
|-------------------------------|------------|
| Primary Dependencies | axios (HTTP), vitest + nock (testing), debug (logging) |
| Testing framework | vitest for both unit and integration tests |
| Project structure | Single-project library + examples (no monorepo complexity) |
| Rate limit retry pattern | Axios interceptor with exponential backoff (5 attempts) |
| Pagination approach | Async generator function with cursor-based iteration |
| Signature verification | Node.js crypto module with HMAC-SHA256 |
| Debug logging | `debug` package with custom token redaction |
| Type definitions | Hand-written TypeScript interfaces with JSDoc |
| Integration test cleanup | Dedicated test space with reverse-order resource deletion |
| Example script structure | Consistent template with validation → operation → output → error handling |

All technical decisions now resolved and ready for Phase 1 (Data Model & Contracts).
