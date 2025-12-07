# Claude AI Assistant Guide for The Brain Project

## Project Overview

**The Brain** is a Non-Fiction AI Authoring Platform - a web-based tool that helps non-fiction authors plan, research, draft, and revise books with AI assistance. Think "Sudowrite for non-fiction" with emphasis on factual accuracy, structure, and collaboration.

## Repository Structure

```
/the-brain
├── apps/
│   ├── web/              # Next.js Frontend
│   └── api/              # Lambda Functions (Python)
├── packages/             # Shared libraries
├── infra/                # AWS CDK Infrastructure
├── docs/                 # Documentation
├── .github/              # GitHub workflows
└── docker-compose.yml    # LocalStack orchestration
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Editor**: TipTap (rich text editing)
- **Collaboration**: Y.js (CRDTs)
- **Styling**: Tailwind CSS
- **State**: React Query + Zustand
- **API Client**: Custom fetch wrapper with MSW mocking

### Backend (AWS Serverless)
- **API Layer**: AWS API Gateway (REST + WebSocket)
- **Compute**: AWS Lambda (Python 3.11+)
- **ORM**: SQLAlchemy 2.0
- **Database**: Aurora Serverless v2 (PostgreSQL-compatible)
- **Cache**: ElastiCache Redis
- **Background Jobs**: AWS Fargate (triggered via SQS)
- **Auth**: JWT with refresh tokens (via Lambda Authorizer)
- **Storage**: S3
- **Infrastructure**: AWS CDK (TypeScript)
- **Local Dev**: LocalStack (AWS emulation)

### AI Layer
- **Abstraction**: Custom gateway service
- **Models**: OpenAI, Anthropic, Gemini (pluggable)
- **Prompts**: Template-based with versioning

### Collaboration Layer
- **Real-time Sync**: Y.js (CRDTs) running on Fargate
- **WebSocket**: Application Load Balancer → Fargate (always-on)
- **State Storage**: ElastiCache Redis for Y.js document state

## Key Architecture Principles

1. **Monorepo**: All code in one repository, managed with workspaces
2. **Serverless-First**: Lambda for API, Fargate for long-running tasks
3. **API-First**: Frontend only communicates through API Gateway
4. **Mocking-Ready**: MSW + LocalStack enable frontend development without AWS
5. **Model-Agnostic**: AI layer abstracts provider-specific details
6. **Real-time**: WebSockets + CRDTs for collaboration (via Fargate)
7. **Testable**: Unit, integration, and E2E testing at all layers
8. **Cost-Optimized**: Pay-per-use with Aurora Serverless and Lambda

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

### Running Locally (with LocalStack)
```bash
# Start LocalStack and supporting services
docker-compose up -d

# Deploy infrastructure to LocalStack
cd infra && cdklocal deploy --all

# Run frontend
cd apps/web && npm run dev

# Invoke Lambda locally (for testing)
awslocal lambda invoke --function-name ApiFunction output.json

# View Lambda logs
awslocal logs tail /aws/lambda/ApiFunction
```

### Database Migrations
```bash
# Connect to LocalStack PostgreSQL
cd apps/api
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/brain" \
  alembic revision --autogenerate -m "description"

# Apply migrations locally
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/brain" \
  alembic upgrade head

# Apply migrations to Aurora (production)
DATABASE_URL=$AURORA_CONNECTION_STRING alembic upgrade head
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
- Verify LocalStack is running: `docker-compose ps`
- Check API Gateway endpoint: `awslocal apigateway get-rest-apis`
- Verify CORS configuration in CDK stack

### LocalStack Issues
- Ensure Docker is running with sufficient memory (4GB+)
- Check LocalStack logs: `docker-compose logs localstack`
- Verify services are healthy: `awslocal lambda list-functions`
- For Aurora issues, ensure LocalStack Pro or use standard PostgreSQL

### Lambda Cold Starts
- Use provisioned concurrency for latency-sensitive endpoints
- Keep Lambda packages small (use layers for dependencies)
- Monitor cold starts in CloudWatch metrics

### AI Requests Timing Out
- Increase Lambda timeout in CDK stack (max 15 minutes)
- Check model provider status
- Verify API keys in Secrets Manager
- Review rate limits

### Collaboration Sync Issues
- Check Fargate task health: `awslocal ecs describe-tasks`
- Verify ElastiCache Redis connection
- Check ALB target group health
- Review Y.js CRDT state
- Check network/security group configuration

## Contributing

1. Create feature branch from `main`
2. Write code + tests
3. Run linters and formatters
4. Submit PR with issue reference
5. Await code review
6. Merge after approval

## Resources

### Frontend & Editor
- [Next.js Docs](https://nextjs.org/docs)
- [TipTap Docs](https://tiptap.dev/)
- [Y.js Docs](https://docs.yjs.dev/)

### AWS & Infrastructure
- [AWS CDK Docs](https://docs.aws.amazon.com/cdk/)
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- [API Gateway Docs](https://docs.aws.amazon.com/apigateway/)
- [Aurora Serverless Docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html)
- [LocalStack Docs](https://docs.localstack.cloud/)

### Backend
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [Boto3 Docs](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)

## Questions?

- Check existing issues and discussions
- Review architecture diagrams in README.md
- Ask in project Discord/Slack
- Tag @ai-team for AI-specific questions

---

**Last Updated**: 2025-12-07
**Project Phase**: MVP Development
**Status**: Active Development
