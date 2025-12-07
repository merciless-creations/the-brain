# Environment Configuration

## Overview

This document describes all environment variables needed for The Brain platform.

## Frontend Environment (.env.local)

Create `apps/web/.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

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
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_WS_URL` | Yes | WebSocket server URL | `ws://localhost:8000` |
| `NEXT_PUBLIC_API_MOCKING` | No | Enable MSW API mocking | `false` |
| `NEXT_PUBLIC_ENABLE_COLLABORATION` | No | Enable real-time collab | `true` |
| `NEXT_PUBLIC_ENABLE_AI_FEATURES` | No | Enable AI features | `true` |
| `NODE_ENV` | Yes | Environment mode | `development` |

---

## Backend Environment (.env)

Create `apps/api/.env`:

```bash
# Application
APP_NAME=The Brain API
APP_ENV=development
DEBUG=true
LOG_LEVEL=info

# Server
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000

# Database
DATABASE_URL=sqlite:///./local.db
# DATABASE_URL=postgresql://user:password@localhost:5432/thebrain

# Redis
REDIS_URL=redis://localhost:6379/0

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600
REFRESH_TOKEN_EXPIRATION=604800

# AI Providers
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

# Celery (Background Jobs)
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

# Object Storage (S3-compatible)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=thebrain-uploads
S3_REGION=us-east-1
S3_USE_SSL=false

# File Upload Limits
MAX_UPLOAD_SIZE=10485760  # 10 MB in bytes
ALLOWED_FILE_TYPES=.pdf,.txt,.md,.docx

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
AI_RATE_LIMIT_PER_HOUR=100

# Security
CORS_ENABLED=true
CORS_ALLOW_CREDENTIALS=true
ENCRYPTION_KEY=your-encryption-key-32-characters-long

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

#### Database
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | SQLAlchemy connection string |

**Examples**:
```bash
# SQLite (local dev)
DATABASE_URL=sqlite:///./local.db

# PostgreSQL (local)
DATABASE_URL=postgresql://postgres:password@localhost:5432/thebrain

# PostgreSQL (production)
DATABASE_URL=postgresql://user:pass@db.example.com:5432/thebrain?sslmode=require
```

#### AI Providers
| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | If using OpenAI | OpenAI API key |
| `ANTHROPIC_API_KEY` | If using Anthropic | Anthropic API key |
| `GOOGLE_AI_API_KEY` | If using Google | Google AI API key |
| `DEFAULT_AI_PROVIDER` | No | Which provider to use by default |

#### Object Storage
| Variable | Required | Description |
|----------|----------|-------------|
| `S3_ENDPOINT` | Yes | S3-compatible endpoint URL |
| `S3_ACCESS_KEY` | Yes | Access key |
| `S3_SECRET_KEY` | Yes | Secret key |
| `S3_BUCKET` | Yes | Bucket name |

**Examples**:
```bash
# MinIO (local)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin

# AWS S3 (production)
S3_ENDPOINT=https://s3.us-east-1.amazonaws.com
S3_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
S3_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Cloudflare R2
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
```

---

## Docker Compose Environment

Create `.env` in project root:

```bash
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=thebrain

# Redis
REDIS_PASSWORD=

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
```

---

## Environment by Deployment Type

### Local Development
```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_MOCKING=false

# Backend
DATABASE_URL=sqlite:///./local.db
REDIS_URL=redis://localhost:6379/0
DEBUG=true
```

### Staging
```bash
# Frontend
NEXT_PUBLIC_API_URL=https://api-staging.thebrain.io
NEXT_PUBLIC_API_MOCKING=false

# Backend
DATABASE_URL=postgresql://user:pass@staging-db.example.com:5432/thebrain
REDIS_URL=redis://staging-redis.example.com:6379/0
DEBUG=false
LOG_LEVEL=info
```

### Production
```bash
# Frontend
NEXT_PUBLIC_API_URL=https://api.thebrain.io
NEXT_PUBLIC_API_MOCKING=false

# Backend
DATABASE_URL=postgresql://user:pass@prod-db.example.com:5432/thebrain?sslmode=require
REDIS_URL=rediss://prod-redis.example.com:6379/0?ssl_cert_reqs=required
DEBUG=false
LOG_LEVEL=warning
SENTRY_DSN=https://...
```

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
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_API_MOCKING=false
NODE_ENV=development
```

### apps/api/.env.example
```bash
APP_ENV=development
DEBUG=true
DATABASE_URL=sqlite:///./local.db
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=change-this-to-a-secure-random-string
OPENAI_API_KEY=sk-your-key-here
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=thebrain-uploads
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

### "Database connection failed"
```bash
# Test PostgreSQL connection
psql -U postgres -h localhost -d thebrain

# Check DATABASE_URL format
# postgresql://user:password@host:port/database
```

### "Redis connection failed"
```bash
# Test Redis connection
redis-cli ping

# Should return: PONG
```

### "S3 upload failed"
```bash
# Test MinIO connection
mc alias set local http://localhost:9000 minioadmin minioadmin
mc ls local
```

---

## Loading Environment Variables

### Next.js
Automatically loads `.env.local` in development.

Variables prefixed with `NEXT_PUBLIC_` are available in browser.

### FastAPI
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### Docker Compose
```yaml
services:
  api:
    env_file:
      - .env
    environment:
      - DATABASE_URL=${DATABASE_URL}
```

---

**Last Updated**: 2025-12-07
**Version**: 1.0
