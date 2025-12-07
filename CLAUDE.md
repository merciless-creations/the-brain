# Claude AI Assistant Guide for The Brain Project

## Project Overview

**The Brain** is a Non-Fiction AI Authoring Platform - a web-based tool that helps non-fiction authors plan, research, draft, and revise books with AI assistance. Think "Sudowrite for non-fiction" with emphasis on factual accuracy, structure, and collaboration.

## Repository Structure

```
/the-brain
├── apps/
│   ├── web/              # Next.js Frontend
│   └── api/              # FastAPI Backend
├── packages/             # Shared libraries
├── docs/                 # Documentation
├── .github/              # GitHub workflows
└── docker-compose.yml    # Service orchestration
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Editor**: TipTap (rich text editing)
- **Collaboration**: Y.js (CRDTs)
- **Styling**: Tailwind CSS
- **State**: React Query + Zustand
- **API Client**: Custom fetch wrapper with MSW mocking

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM**: SQLAlchemy 2.0
- **Database**: PostgreSQL (SQLite for local dev)
- **Cache**: Redis
- **Queue**: Celery with Redis broker
- **Auth**: JWT with refresh tokens
- **Storage**: S3-compatible (MinIO for local)

### AI Layer
- **Abstraction**: Custom gateway service
- **Models**: OpenAI, Anthropic, Gemini (pluggable)
- **Prompts**: Template-based with versioning

## Key Architecture Principles

1. **Monorepo**: All code in one repository, managed with workspaces
2. **API-First**: Frontend only communicates through API endpoints
3. **Mocking-Ready**: MSW enables frontend development without backend
4. **Model-Agnostic**: AI layer abstracts provider-specific details
5. **Real-time**: WebSockets + CRDTs for collaboration
6. **Testable**: Unit, integration, and E2E testing at all layers

## Development Workflow

### Starting a New Feature

1. **Read the Issue**: Understand requirements and acceptance criteria
2. **Check Dependencies**: Review related issues and blockers
3. **Plan First**: Always create a plan before coding
4. **Small PRs**: Break large features into reviewable chunks
5. **Test Coverage**: Write tests alongside implementation

### Testing Strategy

- **Unit Tests**: All business logic (pytest for Python, Jest for TS)
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Critical user flows (Playwright)
- **Mocking**: Use fixtures and MSW for external dependencies

### Code Quality

- **Linting**: ESLint (TS), Ruff (Python)
- **Formatting**: Prettier (TS), Black (Python)
- **Type Safety**: TypeScript strict mode, Python type hints
- **Pre-commit**: Husky hooks for linting and tests

## AI Integration Guidelines

### When to Use AI Models

- Chapter/section generation
- Paragraph expansion
- Text rewriting and style transformation
- Research summarization
- Consistency checking
- Citation suggestions

### AI Safety & Accuracy

- Always tag uncertainty levels on generated content
- Implement "Fact-Lock" to protect verified statements
- Log all AI operations for audit
- Rate-limit AI calls per user
- Cache frequent requests

### Prompt Engineering

- Store prompts in version-controlled templates
- Include examples (few-shot learning)
- Specify output format clearly
- Set temperature appropriately per use case
- Monitor token usage and costs

## Database Schema Key Entities

```python
# Core Models
- User: Authentication and profile
- Project: Book-level container
- Chapter: Content sections with versioning
- ResearchNote: User's research vault
- Version: Historical snapshots
- Comment: Thread-based feedback
- Citation: Bibliography entries
```

## API Design Patterns

### RESTful Endpoints
```
/api/v1/projects
/api/v1/projects/{id}/chapters
/api/v1/projects/{id}/research
/api/v1/ai/draft
/api/v1/ai/rewrite
/api/v1/export/{format}
```

### WebSocket Events
```
collaboration:join
collaboration:update
collaboration:cursor
collaboration:presence
```

## Common Tasks

### Running Locally
```bash
# Start all services
docker-compose up -d

# Run frontend
cd apps/web && npm run dev

# Run API
cd apps/api && uvicorn main:app --reload
```

### Database Migrations
```bash
cd apps/api
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Running Tests
```bash
# Frontend
cd apps/web && npm test

# Backend
cd apps/api && pytest
```

## Security Considerations

- **Auth**: JWT tokens with short expiry, refresh token rotation
- **Rate Limiting**: Per-user, per-endpoint limits
- **Encryption**: All uploads encrypted at rest
- **Audit Logs**: Track all user actions and AI operations
- **Input Validation**: Strict schemas on all endpoints
- **CORS**: Whitelist frontend origin only

## Performance Targets

- API response: <200ms (p95)
- AI operations: <8s (p95)
- Editor: Stable with 80k+ word manuscripts
- Collaboration: <200ms latency for updates
- Export: <5s for typical book length

## Troubleshooting Common Issues

### Frontend Not Connecting to API
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify API server is running
- Check CORS configuration

### AI Requests Timing Out
- Increase timeout in AI gateway
- Check model provider status
- Verify API keys are valid
- Review rate limits

### Collaboration Sync Issues
- Check Redis connection
- Verify WebSocket connection
- Review Y.js CRDT state
- Check for network issues

## Contributing

1. Create feature branch from `main`
2. Write code + tests
3. Run linters and formatters
4. Submit PR with issue reference
5. Await code review
6. Merge after approval

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [TipTap Docs](https://tiptap.dev/)
- [Y.js Docs](https://docs.yjs.dev/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)

## Questions?

- Check existing issues and discussions
- Review architecture diagrams in README.md
- Ask in project Discord/Slack
- Tag @ai-team for AI-specific questions

---

**Last Updated**: 2025-12-07
**Project Phase**: MVP Development
**Status**: Active Development
