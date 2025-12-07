# The Brain - Monorepo

This is the root of The Brain monorepo containing both frontend and backend applications.

## Structure

```
/the-brain
├── apps/
│   ├── web/         # Next.js Frontend
│   └── api/         # FastAPI Backend
├── packages/        # Shared packages (future)
└── package.json     # Root workspace configuration
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Python 3.11+
- Git

### Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd apps/web
npm install

# Install backend dependencies (in virtual environment)
cd apps/api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Development

**Run both frontend and backend:**
```bash
npm run dev
```

**Run individually:**
```bash
# Frontend only (with API mocking enabled)
npm run dev:web

# Backend only
npm run dev:api
```

### Frontend (apps/web)

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **API Mocking**: MSW (Mock Service Worker)
- **Port**: 3000

See [apps/web/README.md](./apps/web/README.md) for details.

### Backend (apps/api)

- **Framework**: FastAPI
- **Database**: SQLite (local) → PostgreSQL (production)
- **ORM**: SQLAlchemy 2.0
- **Port**: 8000

See [apps/api/README.md](./apps/api/README.md) for details.

## Documentation

- [Design System](./DESIGN_SYSTEM.md)
- [Design Components](./DESIGN_COMPONENTS.md)
- [Design Layouts](./DESIGN_LAYOUTS.md)
- [API Conventions](./API_CONVENTIONS.md)
- [Development Workflow](./WORKFLOW.md)
- [Environment Setup](./ENVIRONMENT.md)
- [Skills Required](./SKILLS.md)
- [Resources](./RESOURCES.md)
- [Roadmap](./ROADMAP.md)

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_API_MOCKING=true  # Set to false to use real API
```

### Backend (.env)
```bash
DATABASE_URL=sqlite:///./local.db
JWT_SECRET=your-secret-key
ALLOWED_ORIGINS=http://localhost:3000
```

## Project Status

- ✅ Monorepo structure created
- ✅ Frontend initialized (Next.js + TipTap + MSW)
- ✅ Backend initialized (FastAPI + SQLite)
- ✅ API mocking configured
- 🚧 Core features in development

See [ROADMAP.md](./ROADMAP.md) for detailed progress.

## License

MIT
