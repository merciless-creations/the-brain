# API Development First Steps - Clerk Authentication Integration

**Date**: 2025-12-07  
**Status**: Planning Phase  
**Goal**: Get API development underway with secure Clerk authentication

---

## Executive Summary

The Brain API will use **Clerk for authentication** (per project requirements), FastAPI for the API layer, and AWS Lambda for serverless deployment. This document outlines the critical first steps to get development started.

---

## Critical Path: Priority Order

### Phase 0: Local Development Setup (1-2 days)
**Must complete first - blocks everything**

1. **Set up local PostgreSQL** (Issue #3)
   - Add to docker-compose.yml
   - Test connection from API
   - Ready for schema deployment

2. **Set up local Redis** (Issue #24)
   - Add to docker-compose.yml
   - Test connection
   - Ready for caching/sessions

3. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15
       ports:
         - "5432:5432"
       environment:
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
         POSTGRES_DB: thebrain
       volumes:
         - postgres_data:/var/lib/postgresql/data
     
     redis:
       image: redis:7-alpine
       ports:
         - "6379:6379"
       command: redis-server --appendonly yes --maxmemory 256mb
       volumes:
         - redis_data:/data
   
   volumes:
     postgres_data:
     redis_data:
   ```

### Phase 1: Database Schema (2-3 days)
**Issue #26 - Required for all data operations**

1. **Install dependencies**
   ```bash
   cd apps/api
   pip install sqlalchemy[asyncio] alembic asyncpg psycopg2-binary
   ```

2. **Create database models** (SQLAlchemy 2.0)
   - `app/models/base.py` - Base configuration
   - `app/models/user.py` - User model (NO password field - Clerk handles auth)
   - `app/models/project.py` - Project model
   - `app/models/chapter.py` - Chapter model
   - `app/models/research_note.py` - Research vault
   - `app/models/version.py` - Version history
   - `app/models/comment.py` - Comment threads
   - `app/models/citation.py` - Bibliography

3. **Set up Alembic migrations**
   ```bash
   alembic init alembic
   # Edit alembic/env.py for async support
   alembic revision --autogenerate -m "initial schema"
   alembic upgrade head
   ```

4. **Key schema decisions**
   - UUID primary keys (not integers)
   - Soft deletes on all entities (deleted_at column)
   - Timestamps (created_at, updated_at) auto-managed
   - Foreign key constraints with proper indexes
   - JSONB for flexible metadata storage

### Phase 2: Clerk Authentication Integration (2-3 days)
**Issue #5 - Blocks all protected routes**

#### Frontend Setup (Next.js)

1. **Install Clerk SDK**
   ```bash
   cd apps/web
   npm install @clerk/nextjs
   ```

2. **Environment variables** (`apps/web/.env.local`)
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

3. **Root layout integration** (`apps/web/app/layout.tsx`)
   ```typescript
   import { ClerkProvider } from '@clerk/nextjs'
   
   export default function RootLayout({ children }) {
     return (
       <ClerkProvider>
         <html lang="en">
           <body>{children}</body>
         </html>
       </ClerkProvider>
     )
   }
   ```

4. **Create auth pages**
   - `apps/web/app/sign-in/[[...sign-in]]/page.tsx`
   - `apps/web/app/sign-up/[[...sign-up]]/page.tsx`

5. **Protected routes middleware** (`apps/web/middleware.ts`)
   ```typescript
   import { authMiddleware } from '@clerk/nextjs'
   
   export default authMiddleware({
     publicRoutes: ['/', '/sign-in', '/sign-up'],
     ignoredRoutes: ['/api/webhooks/clerk']
   })
   ```

#### Backend Setup (FastAPI)

1. **Install Clerk Python SDK**
   ```bash
   cd apps/api
   pip install clerk-backend-api svix
   ```

2. **Environment variables** (`apps/api/.env`)
   ```env
   CLERK_SECRET_KEY=sk_test_...
   CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_WEBHOOK_SECRET=whsec_...
   DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/thebrain
   REDIS_URL=redis://localhost:6379/0
   ```

3. **Create Clerk utilities** (`app/utils/clerk.py`)
   ```python
   from clerk_backend_api import Clerk
   from app.config import get_settings
   
   settings = get_settings()
   clerk_client = Clerk(bearer_auth=settings.clerk_secret_key)
   
   def verify_session_token(token: str):
       """Verify Clerk JWT token"""
       try:
           session = clerk_client.sessions.verify_token(token)
           return session
       except Exception:
           return None
   ```

4. **Auth middleware** (`app/middleware/clerk_auth.py`)
   ```python
   from fastapi import HTTPException, Security, Depends
   from fastapi.security import HTTPBearer
   from app.utils.clerk import verify_session_token
   from app.models.user import User
   
   security = HTTPBearer()
   
   async def get_current_user(
       credentials = Security(security),
       db = Depends(get_db)
   ) -> User:
       token = credentials.credentials
       session = verify_session_token(token)
       
       if not session:
           raise HTTPException(status_code=401, detail="Invalid token")
       
       user = await db.get(User, clerk_user_id=session.user_id)
       if not user:
           raise HTTPException(status_code=404, detail="User not found")
       
       return user
   ```

5. **Webhook handler** (`app/routes/webhooks.py`)
   ```python
   from fastapi import APIRouter, Request, HTTPException
   from svix.webhooks import Webhook
   from app.models.user import User
   
   router = APIRouter(prefix="/webhooks", tags=["webhooks"])
   
   @router.post("/clerk")
   async def clerk_webhook(request: Request, db = Depends(get_db)):
       # Verify webhook signature
       wh = Webhook(settings.clerk_webhook_secret)
       payload = await request.body()
       headers = dict(request.headers)
       
       try:
           evt = wh.verify(payload, headers)
       except Exception as e:
           raise HTTPException(status_code=400, detail=str(e))
       
       # Handle events
       if evt["type"] == "user.created":
           user = User(
               clerk_user_id=evt["data"]["id"],
               email=evt["data"]["email_addresses"][0]["email_address"],
               full_name=f"{evt['data'].get('first_name', '')} {evt['data'].get('last_name', '')}".strip()
           )
           db.add(user)
           await db.commit()
       
       return {"success": True}
   ```

6. **Update User model** - NO password field!
   ```python
   class User(Base):
       __tablename__ = "users"
       
       id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
       clerk_user_id = Column(String(255), unique=True, nullable=False, index=True)
       email = Column(String(255), unique=True, nullable=False)
       full_name = Column(String(255))
       subscription_tier = Column(String(50), default="free")
       is_active = Column(Boolean, default=True)
       created_at = Column(DateTime(timezone=True), server_default=func.now())
       updated_at = Column(DateTime(timezone=True), onupdate=func.now())
       
       # NO password_hash column - Clerk handles authentication!
   ```

7. **Protected route example**
   ```python
   from app.middleware.clerk_auth import get_current_user
   
   @router.get("/projects")
   async def list_projects(
       current_user: User = Depends(get_current_user),
       db = Depends(get_db)
   ):
       projects = await db.query(Project).filter(
           Project.user_id == current_user.id
       ).all()
       return {"data": projects}
   ```

#### Clerk Dashboard Configuration

1. Go to https://clerk.com and create account
2. Create new application: "The Brain"
3. Configure settings:
   - Enable email/password authentication
   - Require email verification
   - Add webhook endpoint: `https://your-api.com/webhooks/clerk`
   - Copy webhook secret to `.env`

### Phase 3: Core API Structure (1-2 days)

1. **API route organization**
   ```
   app/routes/
   ├── auth.py          # Get current user, refresh tokens
   ├── webhooks.py      # Clerk webhooks
   ├── projects.py      # CRUD for projects
   ├── chapters.py      # CRUD for chapters
   ├── research.py      # Research vault
   └── ai.py            # AI operations (placeholder)
   ```

2. **API endpoints to implement**
   ```
   # Auth (Clerk handles login/signup)
   GET  /api/v1/auth/me              # Get current user
   POST /api/webhooks/clerk          # Sync users from Clerk
   
   # Projects
   GET    /api/v1/projects           # List user's projects
   POST   /api/v1/projects           # Create project
   GET    /api/v1/projects/{id}      # Get project
   PUT    /api/v1/projects/{id}      # Update project
   DELETE /api/v1/projects/{id}      # Soft delete project
   
   # Chapters
   GET    /api/v1/projects/{id}/chapters           # List chapters
   POST   /api/v1/projects/{id}/chapters           # Create chapter
   GET    /api/v1/projects/{id}/chapters/{cid}     # Get chapter
   PUT    /api/v1/projects/{id}/chapters/{cid}     # Update chapter
   DELETE /api/v1/projects/{id}/chapters/{cid}     # Soft delete chapter
   ```

3. **Standardized response format**
   ```python
   # Success
   {
     "data": { ... },
     "meta": { "total": 10, "page": 1 }
   }
   
   # Error
   {
     "error": {
       "code": "VALIDATION_ERROR",
       "message": "Invalid project ID",
       "details": { ... }
     }
   }
   ```

### Phase 4: Local Testing (1 day)

1. **Start services**
   ```bash
   docker-compose up -d
   cd apps/api
   uvicorn app.main:app --reload --port 8000
   cd ../web
   npm run dev
   ```

2. **Test authentication flow**
   - Sign up at http://localhost:3000/sign-up
   - Verify webhook creates user in database
   - Log in and get redirected to dashboard
   - Test protected API route with Clerk token

3. **Test API endpoints**
   ```bash
   # Health check
   curl http://localhost:8000/health
   
   # Get current user (requires Clerk token from frontend)
   curl http://localhost:8000/api/v1/auth/me \
     -H "Authorization: Bearer <clerk_token>"
   
   # Create project
   curl -X POST http://localhost:8000/api/v1/projects \
     -H "Authorization: Bearer <clerk_token>" \
     -H "Content-Type: application/json" \
     -d '{"title": "My Book"}'
   ```

### Phase 5: AI Gateway Stub (1 day)
**Issue #22 - Prepare for AI features**

1. **Create AI service structure**
   ```
   app/services/ai/
   ├── base.py          # Base provider interface
   ├── openai.py        # OpenAI implementation
   ├── anthropic.py     # Claude implementation
   └── gateway.py       # Unified API
   ```

2. **Stub implementations** (return mock data for now)
   ```python
   class AIGateway:
       async def generate_chapter(self, topic: str, purpose: str):
           return {"outline": ["Section 1", "Section 2"]}
       
       async def expand_bullets(self, bullets: list):
           return {"text": "Expanded paragraph from bullets..."}
   ```

3. **API endpoints (mock responses)**
   ```
   POST /api/v1/ai/draft      # Generate chapter outline
   POST /api/v1/ai/expand     # Expand bullets to prose
   POST /api/v1/ai/rewrite    # Transform text
   POST /api/v1/ai/summarize  # Summarize research
   ```

---

## Success Criteria

### Phase 0 ✅
- [ ] PostgreSQL running locally
- [ ] Redis running locally
- [ ] API can connect to both

### Phase 1 ✅
- [ ] Database schema defined
- [ ] Alembic migrations run
- [ ] All tables created with indexes

### Phase 2 ✅
- [ ] Clerk integration working
- [ ] User can sign up via Clerk
- [ ] Webhook syncs user to database
- [ ] Protected routes require Clerk token
- [ ] Current user endpoint returns data

### Phase 3 ✅
- [ ] CRUD routes for Projects
- [ ] CRUD routes for Chapters
- [ ] All routes protected with Clerk auth
- [ ] Proper error handling

### Phase 4 ✅
- [ ] Full authentication flow works
- [ ] Can create/read/update/delete projects
- [ ] Frontend can call API successfully

### Phase 5 ✅
- [ ] AI endpoints stubbed
- [ ] Ready for real AI integration

---

## What's Different from Original Plan

### ✅ Using Clerk (not custom JWT)
- **Time savings**: 2-3 weeks → 2-3 days
- **No password storage** in our database
- **No refresh token table** needed
- **Built-in security** (SOC 2, HIPAA compliant)
- **Free tier**: 10,000 MAU (perfect for MVP)

### ✅ No Lambda Authorizer needed
- Clerk SDK verifies tokens in FastAPI middleware
- Simpler architecture
- Easier local testing

### ✅ User model simplified
```python
# OLD (custom auth)
class User:
    id: UUID
    email: str
    password_hash: str  ❌
    refresh_tokens: List[RefreshToken]  ❌
    
# NEW (Clerk)
class User:
    id: UUID
    clerk_user_id: str  ✅ (Clerk's user ID)
    email: str
    # NO passwords, NO tokens!
```

---

## Estimated Timeline

| Phase | Duration | Blocker |
|-------|----------|---------|
| Phase 0: Local setup | 1 day | None |
| Phase 1: Database schema | 2 days | Phase 0 |
| Phase 2: Clerk integration | 3 days | Phase 1 |
| Phase 3: Core API | 2 days | Phase 2 |
| Phase 4: Testing | 1 day | Phase 3 |
| Phase 5: AI stubs | 1 day | Phase 3 |
| **Total** | **~10 days** | |

---

## Next Steps After These First Steps

Once the above is complete, proceed to:

1. **Real AI integration** (Issue #22) - Connect OpenAI/Anthropic
2. **Background workers** (Issue #23) - SQS + Fargate for long jobs
3. **WebSocket/Y.js** (Issue #25) - Real-time collaboration
4. **TipTap editor** (Issue #18) - Rich text editing
5. **AWS deployment** - CDK infrastructure for production

---

## Key Files to Create

```
the-brain/
├── docker-compose.yml                        # NEW - Local services
├── apps/
│   ├── api/
│   │   ├── .env                              # NEW - API config
│   │   ├── requirements.txt                  # UPDATE - Add Clerk SDK
│   │   ├── alembic/                          # NEW - Migrations
│   │   │   ├── env.py
│   │   │   └── versions/
│   │   └── app/
│   │       ├── models/                       # NEW - Database models
│   │       │   ├── base.py
│   │       │   ├── user.py                   # NO password field!
│   │       │   ├── project.py
│   │       │   ├── chapter.py
│   │       │   └── ...
│   │       ├── routes/                       # NEW - API endpoints
│   │       │   ├── auth.py
│   │       │   ├── webhooks.py               # Clerk webhooks
│   │       │   ├── projects.py
│   │       │   └── chapters.py
│   │       ├── middleware/                   # NEW - Auth middleware
│   │       │   └── clerk_auth.py
│   │       └── utils/                        # NEW - Utilities
│   │           └── clerk.py
│   └── web/
│       ├── .env.local                        # NEW - Clerk keys
│       ├── middleware.ts                     # NEW - Clerk middleware
│       └── app/
│           ├── sign-in/[[...sign-in]]/page.tsx    # NEW
│           └── sign-up/[[...sign-up]]/page.tsx    # NEW
```

---

## Common Issues & Solutions

### Issue: Clerk webhook not firing locally
**Solution**: Use ngrok or LocalTunnel to expose localhost, add URL to Clerk dashboard

### Issue: Database connection fails
**Solution**: Ensure docker-compose services are running: `docker-compose ps`

### Issue: Clerk token verification fails
**Solution**: Check that CLERK_SECRET_KEY matches in both frontend and backend .env files

### Issue: CORS errors in frontend
**Solution**: Add frontend origin to FastAPI CORS middleware

---

## Resources

- **Clerk Docs**: https://clerk.com/docs
- **FastAPI + Clerk**: https://clerk.com/docs/backend-requests/handling/python
- **SQLAlchemy 2.0**: https://docs.sqlalchemy.org/en/20/
- **TipTap**: https://tiptap.dev/docs/editor/introduction
- **Y.js**: https://docs.yjs.dev/

---

## Open Questions

1. **AI Model Selection**: OpenAI GPT-4 or Anthropic Claude? (Or both?)
2. **Deployment Target**: Stay with AWS Lambda or switch to Fargate for all compute?
3. **Collaboration Scope**: MVP just needs Y.js syncing or presence indicators too?
4. **Rate Limiting**: What limits per tier (free vs paid)?

---

**Status**: Ready to begin Phase 0  
**Owner**: API Development Team  
**Last Updated**: 2025-12-07
