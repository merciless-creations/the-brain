# Backend - The Brain API

FastAPI application with SQLAlchemy and SQLite (local) / PostgreSQL (production).

## Features

- ✅ FastAPI with automatic OpenAPI docs
- ✅ SQLAlchemy 2.0 ORM
- ✅ SQLite for local development
- ✅ PostgreSQL-ready (just change DATABASE_URL)
- ✅ Pydantic v2 for validation
- ✅ CORS configured
- 🚧 JWT authentication (coming soon)

## Getting Started

### Prerequisites

- Python 3.11 or higher
- pip

### Setup Virtual Environment

```bash
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your settings. The defaults work for local development.

### Run Development Server

```bash
uvicorn main:app --reload
```

API will be available at:
- **API**: http://localhost:8000
- **OpenAPI Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Database

SQLite database file (`local.db`) is created automatically on first run.

To use PostgreSQL instead, change `DATABASE_URL` in `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/thebrain
```

## Project Structure

```
/apps/api
├── app/
│   ├── __init__.py
│   ├── config.py        # Settings management
│   ├── database.py      # Database connection
│   ├── models/          # SQLAlchemy models
│   │   └── project.py
│   ├── routes/          # API endpoints
│   │   └── projects.py
│   └── schemas/         # Pydantic schemas
│       └── project.py
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
└── local.db             # SQLite database (created at runtime)
```

## API Endpoints

### Health Check

```bash
GET /health
```

### Projects

```bash
GET    /api/v1/projects           # List all projects
POST   /api/v1/projects           # Create project
GET    /api/v1/projects/{id}      # Get single project
GET    /api/v1/projects/{id}/chapters  # Get chapters
POST   /api/v1/projects/{id}/chapters  # Create chapter
```

## Database Models

### Project
- id (Integer, PK)
- title (String)
- status (String)
- created_at (DateTime)
- updated_at (DateTime)

### Chapter
- id (Integer, PK)
- project_id (Integer, FK)
- title (String)
- content (Text)
- order (Integer)
- status (String)
- created_at (DateTime)
- updated_at (DateTime)

## API Response Format

All responses follow the JSON:API-like format:

```json
{
  "data": {
    "id": "1",
    "type": "project",
    "attributes": {
      "title": "My Book",
      "status": "draft",
      "chapter_count": 5,
      "word_count": 12450,
      "created_at": "2025-12-01T10:00:00Z",
      "updated_at": "2025-12-07T15:30:00Z"
    }
  }
}
```

## Configuration

Settings are managed via `app/config.py` using Pydantic Settings.

Environment variables:
- `APP_NAME`: Application name
- `DEBUG`: Enable debug mode
- `DATABASE_URL`: Database connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `ALLOWED_ORIGINS`: CORS allowed origins (comma-separated)

## Testing

```bash
# Run tests (when implemented)
pytest
```

## Deployment

### Local
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Production
Use gunicorn with uvicorn workers:

```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Switching to PostgreSQL

1. Install PostgreSQL locally or use a cloud service (Neon, Supabase, etc.)
2. Update `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database
   ```
3. Restart the server - SQLAlchemy will create tables automatically

No code changes needed!

## Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
