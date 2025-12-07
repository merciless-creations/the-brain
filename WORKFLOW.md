# Development Workflow Guide

## Daily Development Process

### 1. Starting Work

#### Pull Latest Changes
```bash
git checkout main
git pull origin main
```

#### Create Feature Branch
```bash
# Pattern: type/issue-number-short-description
git checkout -b feature/6-chapter-generator
git checkout -b fix/23-worker-queue-crash
git checkout -b chore/update-dependencies
```

#### Check Issue Details
```bash
gh issue view 6
```

### 2. Development Cycle

#### Start Development Environment
```bash
# Terminal 1: Start LocalStack and supporting services
docker-compose up -d

# Terminal 2: Deploy infrastructure to LocalStack
cd infra
npm install
cdklocal deploy --all

# Terminal 3: Start Frontend
cd apps/web
npm run dev

# Note: API is served by Lambda functions in LocalStack, no separate backend process needed
```

#### Get API Gateway URL
After CDK deployment, get the API Gateway URL:
```bash
awslocal apigateway get-rest-apis
# Copy the API ID and construct URL:
# http://localhost:4566/restapis/<api-id>/local/_user_request_/api/v1/...
```

#### Write Code
- Follow coding standards (see CONVENTIONS.md)
- Keep commits small and focused
- Write tests alongside code
- Update documentation as you go

#### Run Tests Frequently
```bash
# Frontend tests
cd apps/web
npm test

# Backend tests (Lambda functions)
cd apps/api
pytest

# Run specific test
pytest tests/test_chapters.py::test_create_chapter

# Integration tests against LocalStack
pytest tests/integration/ --localstack
```

#### Redeploy After Lambda Code Changes
```bash
# Hot reload is not automatic - redeploy after Lambda changes
cd infra && cdklocal deploy ApiStack --hotswap
```

### 3. Code Quality Checks

#### Before Committing
```bash
# Frontend
npm run lint
npm run type-check
npm run format

# Backend
ruff check .
black .
mypy .
```

#### Pre-commit Hook (Auto-runs)
```bash
# Install once
npm install husky -D
npx husky install
```

### 4. Committing Changes

#### Commit Message Format
```
type(scope): short description

Longer explanation if needed.

Fixes #issue-number
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

#### Examples
```bash
git add .
git commit -m "feat(drafting): add chapter outline generator

Implements the structured chapter generator that takes
topic + purpose and outputs hierarchical outline.

Fixes #6"

git commit -m "fix(api): handle empty chapter content

Prevents 500 error when chapter content is null.

Fixes #45"

git commit -m "docs: update API conventions for pagination"
```

### 5. Pushing & Pull Requests

#### Push Branch
```bash
git push origin feature/6-chapter-generator
```

#### Create Pull Request
```bash
# Using GitHub CLI
gh pr create --title "feat(drafting): add chapter outline generator" \
  --body "Implements issue #6. See CHANGELOG.md for details." \
  --base main

# Or via GitHub web interface
```

#### PR Template
```markdown
## Description
Brief description of changes

## Related Issue
Fixes #6

## Type of Change
- [ ] Bug fix
- [x] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing completed

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [x] Code follows style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic
- [x] Documentation updated
- [x] Tests added/updated
- [x] No new warnings
```

### 6. Code Review Process

#### As Author
- Respond to comments promptly
- Make requested changes in new commits
- Push updates to same branch
- Re-request review when ready

#### As Reviewer
- Check code quality and logic
- Verify tests are adequate
- Test locally if significant change
- Approve or request changes

### 7. Merging

#### After Approval
```bash
# Merge via GitHub (preferred - keeps history)
gh pr merge --squash

# Or rebase and merge
gh pr merge --rebase
```

#### Clean Up
```bash
git checkout main
git pull origin main
git branch -d feature/6-chapter-generator
```

---

## Project Setup (First Time)

### Prerequisites
```bash
# Check versions
node --version  # 18+
python --version  # 3.11+
docker --version  # 20+
git --version

# Install AWS CLI and LocalStack tools
pip install awscli-local localstack
npm install -g aws-cdk-local aws-cdk
```

### Clone & Install

#### 1. Clone Repository
```bash
git clone https://github.com/merciless-creations/the-brain.git
cd the-brain
```

#### 2. Install Frontend
```bash
cd apps/web
npm install
cp .env.example .env.local
# Edit .env.local with your settings (update API Gateway URL after CDK deploy)
```

#### 3. Install Backend (Lambda Functions)
```bash
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings
```

#### 4. Install Infrastructure (CDK)
```bash
cd infra
npm install
```

#### 5. Start LocalStack
```bash
# From project root
docker-compose up -d

# Wait for LocalStack to be healthy
curl http://localhost:4566/_localstack/health
```

#### 6. Deploy Infrastructure to LocalStack
```bash
cd infra
cdklocal bootstrap
cdklocal deploy --all

# Note the API Gateway URL from the output
```

#### 7. Setup Database
```bash
# Run migrations against local PostgreSQL
cd apps/api
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/thebrain" alembic upgrade head
```

#### 8. Update Frontend Environment
```bash
# Update .env.local with the API Gateway URL from step 6
# NEXT_PUBLIC_API_URL=http://localhost:4566/restapis/<api-id>/local/_user_request_
```

---

## Testing Strategy

### Unit Tests

#### Frontend (Jest + React Testing Library)
```typescript
// apps/web/components/ChapterOutline.test.tsx
import { render, screen } from '@testing-library/react'
import { ChapterOutline } from './ChapterOutline'

describe('ChapterOutline', () => {
  it('renders chapter title', () => {
    render(<ChapterOutline title="Test Chapter" />)
    expect(screen.getByText('Test Chapter')).toBeInTheDocument()
  })
})
```

#### Backend (pytest)
```python
# apps/api/tests/test_chapters.py
def test_create_chapter(client, auth_headers):
    response = client.post(
        "/api/v1/chapters",
        json={"title": "Test Chapter", "content": "Content"},
        headers=auth_headers
    )
    assert response.status_code == 201
    assert response.json()["data"]["title"] == "Test Chapter"
```

### Integration Tests

```python
# apps/api/tests/integration/test_ai_drafting.py
def test_draft_generation_flow(client, db_session):
    # Create project
    project = create_test_project(db_session)
    
    # Generate draft
    response = client.post(
        f"/api/v1/ai/draft",
        json={"topic": "Test", "project_id": project.id}
    )
    
    assert response.status_code == 200
    assert len(response.json()["data"]["content"]) > 100
```

### E2E Tests (Playwright)

```typescript
// apps/web/e2e/drafting.spec.ts
import { test, expect } from '@playwright/test'

test('create chapter and generate draft', async ({ page }) => {
  await page.goto('/projects/123')
  await page.click('button:has-text("New Chapter")')
  await page.fill('input[name="title"]', 'Test Chapter')
  await page.click('button:has-text("Generate Draft")')
  
  await expect(page.locator('.editor-content')).toContainText('Climate')
})
```

---

## Debugging

### Frontend Debugging

#### Chrome DevTools
- React DevTools extension
- Network tab for API calls
- Console for logs
- Sources for breakpoints

#### VS Code
```json
// .vscode/launch.json
{
  "type": "chrome",
  "request": "launch",
  "name": "Next.js: debug client-side",
  "url": "http://localhost:3000",
  "webRoot": "${workspaceFolder}/apps/web"
}
```

### Backend Debugging (Lambda)

#### View Lambda Logs
```bash
# List available log groups
awslocal logs describe-log-groups

# Tail logs for a specific function
awslocal logs tail /aws/lambda/ApiFunction --follow

# View recent logs
awslocal logs filter-log-events --log-group-name /aws/lambda/ApiFunction
```

#### Invoke Lambda Directly
```bash
# Test Lambda function directly
awslocal lambda invoke \
  --function-name ApiFunction \
  --payload '{"httpMethod": "GET", "path": "/api/v1/health"}' \
  output.json

cat output.json
```

#### VS Code (with LocalStack)
```json
// .vscode/launch.json
{
  "type": "python",
  "request": "launch",
  "name": "Debug Lambda Handler",
  "program": "${workspaceFolder}/apps/api/handlers/projects.py",
  "env": {
    "AWS_ENDPOINT_URL": "http://localhost:4566",
    "DATABASE_URL": "postgresql://postgres:postgres@localhost:5432/thebrain"
  }
}
```

#### Print Debugging
```python
import logging
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def handler(event, context):
    logger.debug(f"Event: {event}")
    logger.info(f"Processing request: {event['path']}")
    logger.warning(f"Slow operation detected")
    logger.error(f"Error: {error}")
```

#### Local Unit Testing (without LocalStack)
```bash
# Run tests with mocked AWS services
cd apps/api
pytest --tb=short -v
```

### Database Debugging

```bash
# Connect to local DB
psql -U postgres -d thebrain

# View recent logs
docker logs the-brain-postgres

# Check connections
SELECT * FROM pg_stat_activity;

# View slow queries
SELECT query, mean_exec_time FROM pg_stat_statements 
ORDER BY mean_exec_time DESC LIMIT 10;
```

---

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_API_MOCKING=false
```

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/thebrain
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
S3_BUCKET=thebrain-uploads
S3_ENDPOINT=http://localhost:9000
```

---

## Common Commands Reference

### Git
```bash
git status
git diff
git log --oneline -10
git stash
git stash pop
git cherry-pick <commit>
git rebase main
```

### npm
```bash
npm install
npm run dev
npm run build
npm test
npm run lint
npm run type-check
```

### Python/pip
```bash
pip install -r requirements.txt
pip freeze > requirements.txt
python -m pytest
python -m pytest -v
python -m pytest --cov
```

### Docker / LocalStack
```bash
docker-compose up -d              # Start LocalStack + services
docker-compose down               # Stop all services
docker-compose logs -f localstack # View LocalStack logs
docker-compose restart redis      # Restart Redis
docker ps                         # List running containers
docker exec -it thebrain-postgres psql -U postgres
```

### AWS CDK (LocalStack)
```bash
cd infra
cdklocal bootstrap               # First time setup
cdklocal deploy --all            # Deploy all stacks
cdklocal deploy ApiStack         # Deploy specific stack
cdklocal deploy --hotswap        # Fast deploy (Lambda only)
cdklocal destroy --all           # Tear down
cdklocal diff                    # Show changes
cdklocal synth                   # Generate CloudFormation
```

### AWS CDK (Production)
```bash
cd infra
cdk deploy --all --profile prod  # Deploy to AWS
cdk diff --profile prod          # Show changes
```

### LocalStack AWS CLI (awslocal)
```bash
# Lambda
awslocal lambda list-functions
awslocal lambda invoke --function-name ApiFunction output.json
awslocal logs tail /aws/lambda/ApiFunction

# API Gateway
awslocal apigateway get-rest-apis
awslocal apigateway get-resources --rest-api-id <id>

# S3
awslocal s3 ls
awslocal s3 mb s3://thebrain-uploads
awslocal s3 cp file.txt s3://thebrain-uploads/

# SQS
awslocal sqs list-queues
awslocal sqs receive-message --queue-url <url>

# Secrets Manager
awslocal secretsmanager list-secrets
awslocal secretsmanager get-secret-value --secret-id <id>
```

### Database
```bash
# Run migrations (local)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/thebrain" alembic upgrade head

# Create migration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/thebrain" alembic revision --autogenerate -m "add chapters table"

# Rollback
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/thebrain" alembic downgrade -1

# History
alembic history
```

---

## Troubleshooting Common Issues

### "Module not found"
```bash
# Frontend
cd apps/web && npm install

# Backend
cd apps/api && pip install -r requirements.txt

# CDK
cd infra && npm install
```

### "Port already in use"
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>

# Common ports: 3000 (frontend), 4566 (LocalStack), 5432 (Postgres), 6379 (Redis)
```

### "LocalStack not starting"
```bash
# Check if LocalStack is running
docker-compose ps

# View logs
docker-compose logs localstack

# Check health
curl http://localhost:4566/_localstack/health

# Restart LocalStack
docker-compose restart localstack
```

### "Lambda not updating"
```bash
# CDK hotswap for faster updates
cd infra && cdklocal deploy --hotswap

# Full redeploy if hotswap doesn't work
cd infra && cdklocal deploy --all

# Check Lambda was updated
awslocal lambda get-function --function-name ApiFunction
```

### "API Gateway 403/404"
```bash
# Get the correct API Gateway URL
awslocal apigateway get-rest-apis

# URL format: http://localhost:4566/restapis/<api-id>/local/_user_request_/api/v1/...

# Test health endpoint
curl http://localhost:4566/restapis/<api-id>/local/_user_request_/api/v1/health
```

### "Database connection failed"
```bash
# Check if Postgres is running
docker ps | grep postgres

# Restart Postgres
docker-compose restart postgres

# Check connection
psql -h localhost -U postgres -d thebrain
```

### "Tests failing"
```bash
# Frontend: Clear cache and retry
npm test -- --clearCache

# Backend: Run with verbose output
pytest -v --tb=long

# Run single test
npm test -- ChapterOutline.test.tsx
pytest tests/test_chapters.py::test_create_chapter -v
```

### "CDK bootstrap failed"
```bash
# For LocalStack, make sure it's running first
docker-compose up -d

# Then bootstrap
cdklocal bootstrap

# If still failing, try destroying and redeploying
cdklocal destroy --all
cdklocal bootstrap
cdklocal deploy --all
```

---

**Last Updated**: 2025-12-07
**Version**: 2.0 (AWS Serverless)
**Maintained By**: The Brain Development Team
