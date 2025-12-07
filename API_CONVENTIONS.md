# API Conventions & Standards

## General Principles

1. **RESTful Design**: Use standard HTTP methods and status codes
2. **Versioning**: All endpoints under `/api/v1/`
3. **Consistency**: Uniform patterns across all endpoints
4. **Documentation**: OpenAPI/Swagger auto-generated via CDK
5. **Error Handling**: Structured error responses
6. **Serverless**: All endpoints served via AWS API Gateway + Lambda

## Architecture Overview

```
Client → API Gateway (REST) → Lambda → Aurora/S3/SQS
Client → ALB (WebSocket) → Fargate (Y.js) → ElastiCache Redis
```

- **REST API**: AWS API Gateway with Lambda integration
- **WebSocket**: Application Load Balancer → Fargate (for Y.js)
- **Background Jobs**: SQS → Fargate tasks

## URL Structure

```
/api/v1/{resource}
/api/v1/{resource}/{id}
/api/v1/{resource}/{id}/{sub-resource}
/api/v1/{resource}/{id}/{sub-resource}/{sub-id}
```

### Examples
```
GET    /api/v1/projects
GET    /api/v1/projects/123
GET    /api/v1/projects/123/chapters
POST   /api/v1/projects/123/chapters
GET    /api/v1/projects/123/chapters/456
PUT    /api/v1/projects/123/chapters/456
DELETE /api/v1/projects/123/chapters/456
```

## HTTP Methods

- **GET**: Retrieve resource(s) - Must be idempotent
- **POST**: Create new resource
- **PUT**: Update entire resource (replace)
- **PATCH**: Partial update
- **DELETE**: Remove resource

## Status Codes

### Success
- `200 OK`: Successful GET, PUT, PATCH, DELETE
- `201 Created`: Successful POST (return created resource)
- `204 No Content`: Successful DELETE (no body)

### Client Errors
- `400 Bad Request`: Invalid input/validation error
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but no permission
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Resource conflict (e.g., duplicate)
- `422 Unprocessable Entity`: Validation failed
- `429 Too Many Requests`: Rate limit exceeded

### Server Errors
- `500 Internal Server Error`: Unexpected server error
- `502 Bad Gateway`: Upstream service error
- `503 Service Unavailable`: Temporary unavailability
- `504 Gateway Timeout`: Upstream timeout

## Request Format

### Headers
```
Content-Type: application/json
Authorization: Bearer {jwt_token}
X-Request-ID: {uuid}
```

### Body (POST/PUT/PATCH)
```json
{
  "title": "Chapter Title",
  "content": "Markdown content...",
  "order": 1,
  "status": "draft"
}
```

### Query Parameters (GET)
```
?page=1
?limit=20
?sort=created_at
?order=desc
?filter[status]=draft
?search=query
```

## Response Format

### Success Response
```json
{
  "data": {
    "id": "uuid",
    "type": "project",
    "attributes": {
      "title": "My Book",
      "created_at": "2025-12-07T10:00:00Z"
    }
  },
  "meta": {
    "request_id": "uuid",
    "timestamp": "2025-12-07T10:00:00Z"
  }
}
```

### List Response
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "project",
      "attributes": {...}
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  },
  "links": {
    "self": "/api/v1/projects?page=1",
    "next": "/api/v1/projects?page=2",
    "last": "/api/v1/projects?page=5"
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  },
  "meta": {
    "request_id": "uuid",
    "timestamp": "2025-12-07T10:00:00Z"
  }
}
```

## Authentication

### Login
```
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "secure_password"
}

Response:
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "expires_in": 3600
}
```

### Refresh Token
```
POST /api/v1/auth/refresh
{
  "refresh_token": "refresh_token"
}
```

### Logout
```
POST /api/v1/auth/logout
Authorization: Bearer {jwt_token}
```

## Pagination

### Request
```
GET /api/v1/projects?page=2&limit=20
```

### Response
```json
{
  "data": [...],
  "meta": {
    "pagination": {
      "page": 2,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

## Filtering & Searching

### Filter by Field
```
GET /api/v1/projects?filter[status]=draft
GET /api/v1/projects?filter[created_at][gte]=2025-01-01
```

### Search
```
GET /api/v1/projects?search=machine+learning
```

### Sorting
```
GET /api/v1/projects?sort=created_at&order=desc
GET /api/v1/projects?sort=-created_at  (minus for desc)
```

## AI Endpoints

### Draft Generation
```
POST /api/v1/ai/draft
{
  "topic": "Climate Change",
  "purpose": "Educational overview",
  "style": "academic",
  "length": "medium"
}

Response:
{
  "data": {
    "content": "Generated text...",
    "metadata": {
      "model": "gpt-4",
      "tokens": 500,
      "confidence": 0.85
    }
  }
}
```

### Text Rewrite
```
POST /api/v1/ai/rewrite
{
  "text": "Original text...",
  "style": "professional",
  "operation": "condense"
}
```

### Research Summary
```
POST /api/v1/ai/summarize
{
  "text": "Long research text...",
  "length": "short"
}
```

## WebSocket Endpoints (Y.js Collaboration)

WebSocket connections for real-time collaboration are handled by Fargate (Y.js server) behind an Application Load Balancer, not API Gateway.

### Connection
```
# LocalStack
ws://localhost:4510/collaboration/{project_id}?token={jwt_token}

# Production
wss://collab.thebrain.io/collaboration/{project_id}?token={jwt_token}
```

### Y.js Protocol
The WebSocket connection uses the Y.js WebSocket protocol for CRDT synchronization:

```
1. Client connects with JWT token
2. Server validates token via Lambda authorizer
3. Y.js sync protocol handles document updates
4. Updates broadcast to all connected clients
```

### Events (Client → Server)
```json
{
  "type": "sync-step-1",
  "data": "[Y.js encoded state vector]"
}
```

### Events (Server → Client)
```json
{
  "type": "sync-step-2",
  "data": "[Y.js encoded diff]"
}
```

### Presence Events
```json
{
  "type": "awareness",
  "data": {
    "user_id": "uuid",
    "cursor": {"line": 10, "column": 5},
    "selection": null
  }
}
```

### Infrastructure Notes
- Y.js server runs on Fargate (always-on, not Lambda)
- Document state persisted to ElastiCache Redis
- ALB handles WebSocket sticky sessions
- Health checks: `/health` endpoint on port 80

## Rate Limiting

Rate limiting is implemented via AWS API Gateway Usage Plans.

### Configuration (via CDK)
```typescript
const usagePlan = api.addUsagePlan('StandardPlan', {
  name: 'Standard',
  throttle: {
    rateLimit: 100,    // requests per second
    burstLimit: 200,   // burst capacity
  },
  quota: {
    limit: 10000,      // requests per day
    period: apigateway.Period.DAY,
  },
});
```

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1638900000
```

### Rate Limit Response (429)
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again in 60 seconds.",
    "retry_after": 60
  }
}
```

### AI Endpoints (Separate Limits)
AI endpoints have lower rate limits due to cost:
```typescript
const aiUsagePlan = api.addUsagePlan('AIPlan', {
  throttle: { rateLimit: 10, burstLimit: 20 },
  quota: { limit: 500, period: apigateway.Period.DAY },
});
```

## File Uploads

### Upload Request
```
POST /api/v1/research/upload
Content-Type: multipart/form-data

file: [binary data]
project_id: uuid
```

### Upload Response
```json
{
  "data": {
    "id": "uuid",
    "filename": "research.pdf",
    "size": 1024000,
    "url": "https://storage.example.com/files/uuid",
    "content_type": "application/pdf"
  }
}
```

## Export

### Request Export
```
POST /api/v1/projects/{id}/export
{
  "format": "docx",
  "include": ["chapters", "research", "citations"]
}

Response:
{
  "data": {
    "job_id": "uuid",
    "status": "processing"
  }
}
```

### Check Export Status
```
GET /api/v1/exports/{job_id}

Response:
{
  "data": {
    "job_id": "uuid",
    "status": "completed",
    "download_url": "https://...",
    "expires_at": "2025-12-08T10:00:00Z"
  }
}
```

## Validation

### Field Validation
- Required fields: Return 422 with field details
- Type validation: Enforce types in schema
- Length limits: Enforce min/max
- Format validation: Email, URL, UUID, etc.

### Example Validation Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title must be between 1 and 200 characters"
      },
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## Versioning Strategy

### Current: v1
- All new features in v1
- Breaking changes require v2

### Future: v2
- Deprecation notice 6 months in advance
- Support both versions for 12 months
- Document migration guide

## Lambda Response Format

Lambda functions must return responses in API Gateway proxy integration format:

### Success Response
```python
def handler(event, context):
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "data": {"id": "uuid", ...},
            "meta": {"request_id": context.aws_request_id}
        })
    }
```

### Error Response
```python
def handler(event, context):
    return {
        "statusCode": 400,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid input"
            }
        })
    }
```

### Event Structure (from API Gateway)
```python
event = {
    "httpMethod": "POST",
    "path": "/api/v1/projects",
    "headers": {"Authorization": "Bearer ..."},
    "queryStringParameters": {"page": "1"},
    "body": '{"title": "My Book"}',
    "requestContext": {
        "authorizer": {
            "claims": {"sub": "user-id", "email": "user@example.com"}
        }
    }
}
```

## Testing

### Test Every Endpoint
- Happy path (200/201)
- Authentication required (401)
- Permission denied (403)
- Not found (404)
- Validation errors (422)
- Rate limiting (429)

### Local Testing (with LocalStack)
```bash
# Deploy to LocalStack
cd infra && cdklocal deploy --all

# Test endpoint
curl -X POST http://localhost:4566/restapis/<api-id>/local/_user_request_/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Test Project"}'
```

### Example Test Structure (pytest)
```python
import pytest
from moto import mock_aws
from apps.api.handlers.projects import handler

@mock_aws
def test_create_project_success():
    event = {
        "httpMethod": "POST",
        "path": "/api/v1/projects",
        "body": '{"title": "My Book"}',
        "requestContext": {
            "authorizer": {"claims": {"sub": "user-123"}}
        }
    }
    response = handler(event, None)
    assert response["statusCode"] == 201
    body = json.loads(response["body"])
    assert "id" in body["data"]

def test_create_project_unauthorized():
    event = {
        "httpMethod": "POST",
        "path": "/api/v1/projects",
        "body": '{"title": "My Book"}',
        "requestContext": {}  # No authorizer
    }
    response = handler(event, None)
    assert response["statusCode"] == 401
```

### Integration Testing
```bash
# Run integration tests against LocalStack
pytest tests/integration/ --localstack

# Run against staging
pytest tests/integration/ --env=staging
```

---

**Last Updated**: 2025-12-07
**Version**: 2.0 (AWS Serverless)
