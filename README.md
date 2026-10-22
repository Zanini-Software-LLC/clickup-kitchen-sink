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

Comprehensive examples covering 90%+ of ClickUp API v2 endpoints:

| Example | Category | Description | API Docs |
|---------|----------|-------------|----------|
| [01-auth-user.ts](examples/01-auth-user.ts) | Authentication | Get authenticated user information | [API Ref](https://developer.clickup.com/reference/getauthorizeduser) |
| [02-workspaces.ts](examples/02-workspaces.ts) | Hierarchy | List accessible workspaces | [API Ref](https://developer.clickup.com/reference/getauthorizedteams) |
| [03-spaces.ts](examples/03-spaces.ts) | Hierarchy | List spaces in workspace | [API Ref](https://developer.clickup.com/reference/getspaces) |
| [04-folders.ts](examples/04-folders.ts) | Hierarchy | List folders in space | [API Ref](https://developer.clickup.com/reference/getfolders) |
| [05-lists.ts](examples/05-lists.ts) | Hierarchy | List task lists | [API Ref](https://developer.clickup.com/reference/getlists) |
| [06-task-crud.ts](examples/06-task-crud.ts) | Tasks | Create, read, update, delete tasks | [API Ref](https://developer.clickup.com/reference/createtask) |
| More examples coming... | - | - | - |

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

🚧 **In Progress**: This is Phase 1 of implementation. Core infrastructure is being built.

- ✅ Project setup and configuration
- ✅ Specification and planning complete
- 🔄 Foundational types and HTTP client (in progress)
- ⏳ Examples and tests (upcoming)

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
