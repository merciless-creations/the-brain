# API Conventions & Standards

## General Principles

1. **RESTful Design**: Use standard HTTP methods and status codes
2. **Versioning**: All endpoints under `/api/v1/`
3. **Consistency**: Uniform patterns across all endpoints
4. **Documentation**: OpenAPI/Swagger auto-generated
5. **Error Handling**: Structured error responses

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

## WebSocket Endpoints

### Connection
```
ws://localhost:8000/ws/collaboration/{project_id}
?token={jwt_token}
```

### Events (Client → Server)
```json
{
  "type": "update",
  "data": {
    "chapter_id": "uuid",
    "operations": [...]
  }
}
```

### Events (Server → Client)
```json
{
  "type": "update",
  "user": "user_id",
  "data": {
    "chapter_id": "uuid",
    "operations": [...]
  }
}
```

## Rate Limiting

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1638900000
```

### Rate Limit Response
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again in 60 seconds.",
    "retry_after": 60
  }
}
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

## Testing

### Test Every Endpoint
- Happy path (200/201)
- Authentication required (401)
- Permission denied (403)
- Not found (404)
- Validation errors (422)
- Rate limiting (429)

### Example Test Structure
```python
def test_create_project_success():
    response = client.post("/api/v1/projects", json=valid_data)
    assert response.status_code == 201
    assert "id" in response.json()["data"]

def test_create_project_unauthorized():
    response = client.post("/api/v1/projects", json=valid_data)
    assert response.status_code == 401
```

---

**Last Updated**: 2025-12-07
