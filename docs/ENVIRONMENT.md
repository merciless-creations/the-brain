# Environment Configuration

## Overview

This document describes all environment variables needed for The Brain platform.

The Brain uses AWS serverless architecture with LocalStack for local development. This guide covers configuration for both local (LocalStack) and production (AWS) environments.

## Frontend Environment (.env.local)

Create `apps/web/.env.local`:

```bash
# API Configuration (LocalStack)
NEXT_PUBLIC_API_URL=http://localhost:4566/restapis/<api-id>/local/_user_request_
NEXT_PUBLIC_WS_URL=ws://localhost:4510  # ALB WebSocket for Y.js

# Feature Flags
NEXT_PUBLIC_API_MOCKING=false
NEXT_PUBLIC_ENABLE_COLLABORATION=true
NEXT_PUBLIC_ENABLE_AI_FEATURES=true

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=
NEXT_PUBLIC_SENTRY_DSN=

# Environment
NODE_ENV=development
```

### Frontend Variables Explained

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | API Gateway endpoint URL | `http://localhost:4566/restapis/...` |
| `NEXT_PUBLIC_WS_URL` | Yes | Y.js WebSocket URL (ALB) | `ws://localhost:4510` |
| `NEXT_PUBLIC_API_MOCKING` | No | Enable MSW API mocking | `false` |
| `NEXT_PUBLIC_ENABLE_COLLABORATION` | No | Enable real-time collab | `true` |
| `NEXT_PUBLIC_ENABLE_AI_FEATURES` | No | Enable AI features | `true` |
| `NODE_ENV` | Yes | Environment mode | `development` |

---

## Backend Environment (.env)

Create `apps/api/.env` (used by Lambda functions):

```bash
# Application
APP_NAME=The Brain API
APP_ENV=development
DEBUG=true
LOG_LEVEL=info

# AWS Configuration (LocalStack)
AWS_ENDPOINT_URL=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1

# Database (Aurora Serverless / Local PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/thebrain

# ElastiCache Redis
REDIS_URL=redis://localhost:6379/0

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600
REFRESH_TOKEN_EXPIRATION=604800

# AI Providers (stored in AWS Secrets Manager in production)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=4096

ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-sonnet-20240229

GOOGLE_AI_API_KEY=
GOOGLE_AI_MODEL=gemini-pro

# Default AI Provider (openai, anthropic, google)
DEFAULT_AI_PROVIDER=openai

# AI Configuration
AI_TIMEOUT=30
AI_MAX_RETRIES=3
AI_CACHE_TTL=3600

# SQS Queue URLs (for background jobs)
AI_JOBS_QUEUE_URL=http://localhost:4566/000000000000/ai-jobs

# S3 Configuration
S3_BUCKET=thebrain-uploads
S3_REGION=us-east-1

# File Upload Limits
MAX_UPLOAD_SIZE=10485760  # 10 MB in bytes
ALLOWED_FILE_TYPES=.pdf,.txt,.md,.docx

# CORS (configured in API Gateway, but useful for local testing)
ALLOWED_ORIGINS=http://localhost:3000

# Monitoring (Optional)
SENTRY_DSN=
SENTRY_ENVIRONMENT=development
```

### Backend Variables Explained

#### Application
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_ENV` | No | `development` | Environment (development/staging/production) |
| `DEBUG` | No | `true` | Enable debug mode |
| `LOG_LEVEL` | No | `info` | Logging level (debug/info/warning/error) |

#### AWS Configuration
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AWS_ENDPOINT_URL` | Local only | - | LocalStack endpoint (not set in prod) |
| `AWS_ACCESS_KEY_ID` | Yes | - | AWS credentials (use `test` for LocalStack) |
| `AWS_SECRET_ACCESS_KEY` | Yes | - | AWS credentials (use `test` for LocalStack) |
| `AWS_DEFAULT_REGION` | Yes | `us-east-1` | AWS region |

#### Database
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |

**Examples**:
```bash
# LocalStack PostgreSQL (local dev)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/thebrain

# Aurora Serverless (production)
DATABASE_URL=postgresql://user:pass@thebrain-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com:5432/thebrain?sslmode=require
```

#### AI Providers
| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | If using OpenAI | OpenAI API key (use Secrets Manager in prod) |
| `ANTHROPIC_API_KEY` | If using Anthropic | Anthropic API key |
| `GOOGLE_AI_API_KEY` | If using Google | Google AI API key |
| `DEFAULT_AI_PROVIDER` | No | Which provider to use by default |

#### SQS (Background Jobs)
| Variable | Required | Description |
|----------|----------|-------------|
| `AI_JOBS_QUEUE_URL` | Yes | SQS queue URL for AI background jobs |

**Examples**:
```bash
# LocalStack
AI_JOBS_QUEUE_URL=http://localhost:4566/000000000000/ai-jobs

# AWS Production
AI_JOBS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/ai-jobs
```

#### S3 Storage
| Variable | Required | Description |
|----------|----------|-------------|
| `S3_BUCKET` | Yes | S3 bucket name |
| `S3_REGION` | Yes | S3 bucket region |

**Note**: In production, use IAM roles instead of access keys. LocalStack uses `AWS_ENDPOINT_URL` to redirect S3 calls.

---

## Docker Compose Environment (LocalStack)

Create `.env` in project root:

```bash
# LocalStack Configuration
LOCALSTACK_AUTH_TOKEN=          # Optional: for LocalStack Pro features
LOCALSTACK_DEBUG=0
LOCALSTACK_SERVICES=lambda,apigateway,s3,sqs,secretsmanager,ecs,ecr,elasticache,rds

# PostgreSQL (for local database, Aurora emulation requires LocalStack Pro)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=thebrain

# Redis (for Y.js state and caching)
REDIS_PASSWORD=

# AWS Credentials (for LocalStack)
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1
```

### docker-compose.yml services

The following services should be defined in `docker-compose.yml`:

```yaml
services:
  localstack:
    image: localstack/localstack:latest
    ports:
      - "4566:4566"           # LocalStack main endpoint
      - "4510-4559:4510-4559" # External service ports (ALB, etc.)
    environment:
      - SERVICES=${LOCALSTACK_SERVICES}
      - DEBUG=${LOCALSTACK_DEBUG}
      - LOCALSTACK_AUTH_TOKEN=${LOCALSTACK_AUTH_TOKEN}
    volumes:
      - "./infra/localstack:/etc/localstack/init/ready.d"
      - "/var/run/docker.sock:/var/run/docker.sock"

  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes

volumes:
  postgres_data:
```

---

## Environment by Deployment Type

### Local Development (LocalStack)
```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4566/restapis/<api-id>/local/_user_request_
NEXT_PUBLIC_WS_URL=ws://localhost:4510
NEXT_PUBLIC_API_MOCKING=false

# Backend (Lambda environment variables)
AWS_ENDPOINT_URL=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/thebrain
REDIS_URL=redis://localhost:6379/0
DEBUG=true
```

### Staging (AWS)
```bash
# Frontend (deployed to Vercel/Amplify)
NEXT_PUBLIC_API_URL=https://api-staging.thebrain.io
NEXT_PUBLIC_WS_URL=wss://collab-staging.thebrain.io
NEXT_PUBLIC_API_MOCKING=false

# Backend (Lambda environment via CDK)
# AWS_ENDPOINT_URL not set (uses real AWS)
DATABASE_URL=postgresql://user:pass@staging-cluster.cluster-xxx.rds.amazonaws.com:5432/thebrain
REDIS_URL=redis://staging-redis.xxx.cache.amazonaws.com:6379/0
DEBUG=false
LOG_LEVEL=info
```

### Production (AWS)
```bash
# Frontend
NEXT_PUBLIC_API_URL=https://api.thebrain.io
NEXT_PUBLIC_WS_URL=wss://collab.thebrain.io
NEXT_PUBLIC_API_MOCKING=false

# Backend (Lambda environment via CDK)
DATABASE_URL=postgresql://user:pass@prod-cluster.cluster-xxx.rds.amazonaws.com:5432/thebrain?sslmode=require
REDIS_URL=rediss://prod-redis.xxx.cache.amazonaws.com:6379/0
DEBUG=false
LOG_LEVEL=warning
SENTRY_DSN=https://...
```

**Note**: In production, sensitive values (API keys, database credentials) should be stored in AWS Secrets Manager and retrieved at runtime.

---

## Required API Keys

### OpenAI
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy to `OPENAI_API_KEY`

**Cost**: ~$0.01-0.03 per request (GPT-4)

### Anthropic
1. Go to [https://console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. Create new API key
3. Copy to `ANTHROPIC_API_KEY`

**Cost**: ~$0.015-0.075 per request (Claude 3)

### Google AI
1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy to `GOOGLE_AI_API_KEY`

**Cost**: Free tier available

---

## Security Best Practices

### ⚠️ Never Commit Secrets
```bash
# Add to .gitignore (already included)
.env
.env.local
.env.*.local
*.key
*.pem
```

### Generating Secure Keys

#### JWT Secret (32+ characters)
```bash
# macOS/Linux
openssl rand -hex 32

# Python
python -c "import secrets; print(secrets.token_hex(32))"

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Encryption Key (32 characters exactly)
```bash
openssl rand -base64 32 | cut -c1-32
```

### Environment Variable Validation

Backend will validate on startup:
- Required variables are present
- Keys are sufficiently complex
- URLs are properly formatted
- Database connection works

---

## Example Files

### apps/web/.env.example
```bash
# After running `cdklocal deploy`, get the API Gateway URL from output
NEXT_PUBLIC_API_URL=http://localhost:4566/restapis/<api-id>/local/_user_request_
NEXT_PUBLIC_WS_URL=ws://localhost:4510
NEXT_PUBLIC_API_MOCKING=false
NODE_ENV=development
```

### apps/api/.env.example
```bash
APP_ENV=development
DEBUG=true

# AWS/LocalStack
AWS_ENDPOINT_URL=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/thebrain

# Redis
REDIS_URL=redis://localhost:6379/0

# Auth
JWT_SECRET=change-this-to-a-secure-random-string

# AI (store in Secrets Manager for production)
OPENAI_API_KEY=sk-your-key-here

# SQS
AI_JOBS_QUEUE_URL=http://localhost:4566/000000000000/ai-jobs

# S3
S3_BUCKET=thebrain-uploads
S3_REGION=us-east-1
```

---

## Troubleshooting

### "Environment variable not found"
```bash
# Check if .env file exists
ls -la apps/api/.env

# Verify variable is in file
cat apps/api/.env | grep JWT_SECRET

# Ensure no spaces around =
# ✅ JWT_SECRET=value
# ❌ JWT_SECRET = value
```

### "LocalStack not starting"
```bash
# Check LocalStack container status
docker-compose ps localstack

# View LocalStack logs
docker-compose logs localstack

# Verify LocalStack is healthy
curl http://localhost:4566/_localstack/health

# Check available services
awslocal --endpoint-url=http://localhost:4566 sts get-caller-identity
```

### "Lambda function not found"
```bash
# List deployed Lambda functions
awslocal lambda list-functions

# Redeploy infrastructure
cd infra && cdklocal deploy --all

# Check Lambda logs
awslocal logs describe-log-groups
awslocal logs tail /aws/lambda/<function-name>
```

### "API Gateway endpoint not working"
```bash
# List API Gateway APIs
awslocal apigateway get-rest-apis

# Get the API ID and test
curl http://localhost:4566/restapis/<api-id>/local/_user_request_/health
```

### "Database connection failed"
```bash
# Test PostgreSQL connection
psql -U postgres -h localhost -d thebrain

# Check DATABASE_URL format
# postgresql://user:password@host:port/database

# Check if PostgreSQL container is running
docker-compose ps postgres
```

### "Redis connection failed"
```bash
# Test Redis connection
redis-cli ping

# Should return: PONG

# Check if Redis container is running
docker-compose ps redis
```

### "S3 upload failed"
```bash
# Test LocalStack S3
awslocal s3 ls

# Create bucket if missing
awslocal s3 mb s3://thebrain-uploads

# Test upload
echo "test" | awslocal s3 cp - s3://thebrain-uploads/test.txt
```

### "SQS messages not processing"
```bash
# List queues
awslocal sqs list-queues

# Check queue attributes
awslocal sqs get-queue-attributes \
  --queue-url http://localhost:4566/000000000000/ai-jobs \
  --attribute-names All

# View messages (without consuming)
awslocal sqs receive-message \
  --queue-url http://localhost:4566/000000000000/ai-jobs \
  --visibility-timeout 0
```

---

## Loading Environment Variables

### Next.js
Automatically loads `.env.local` in development.

Variables prefixed with `NEXT_PUBLIC_` are available in browser.

### Lambda Functions
Environment variables are set via AWS CDK:

```typescript
// infra/lib/api-stack.ts
const apiFunction = new lambda.Function(this, 'ApiFunction', {
  runtime: lambda.Runtime.PYTHON_3_11,
  handler: 'handler.main',
  code: lambda.Code.fromAsset('../apps/api'),
  environment: {
    DATABASE_URL: databaseSecret.secretValueFromJson('url').toString(),
    REDIS_URL: redisCluster.attrRedisEndpointAddress,
    JWT_SECRET: jwtSecret.secretValue.toString(),
  },
});
```

For local development, Lambda functions read from `.env` via the AWS SDK's endpoint override.

### AWS CDK (LocalStack)
Use `cdklocal` wrapper for LocalStack deployment:

```bash
# Install cdklocal
npm install -g aws-cdk-local aws-cdk

# Deploy to LocalStack
cd infra && cdklocal deploy --all

# Deploy to AWS (production)
cd infra && cdk deploy --all --profile production
```

### Docker Compose (LocalStack)
```yaml
services:
  localstack:
    environment:
      - SERVICES=lambda,apigateway,s3,sqs
      - DEBUG=0
```

---

**Last Updated**: 2025-12-07
**Version**: 2.0 (AWS Serverless)
