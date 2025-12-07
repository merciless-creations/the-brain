# Frontend - The Brain Web App

Next.js 14 application with TypeScript and Tailwind CSS.

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript strict mode
- ✅ Tailwind CSS with custom design tokens
- ✅ MSW for API mocking
- ✅ API client library
- 🚧 TipTap rich text editor (coming soon)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_API_MOCKING=true  # Enable API mocking
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### API Mocking

MSW (Mock Service Worker) is configured to intercept API calls when `NEXT_PUBLIC_API_MOCKING=true`.

Mock handlers are in `mocks/handlers.ts`. Add new endpoints there.

To disable mocking and use real API:
```env
NEXT_PUBLIC_API_MOCKING=false
```

### Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

### Type Check

```bash
npm run type-check
```

## Project Structure

```
/apps/web
├── app/                 # Next.js App Router pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # React components
│   └── MSWProvider.tsx  # MSW initialization
├── lib/                 # Utilities and helpers
│   ├── api-client.ts    # API client
│   └── types.ts         # TypeScript types
├── mocks/               # MSW mock handlers
│   ├── handlers.ts      # API mocks
│   └── browser.ts       # MSW worker setup
├── public/              # Static assets
├── .env.local           # Local environment variables
├── .env.example         # Example environment file
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Design System

This project follows The Brain design system:

- **Colors**: Indigo (primary), Pink (secondary)
- **Fonts**: Inter (UI), Merriweather (content)
- **Spacing**: 8pt grid system
- **Components**: See `../DESIGN_COMPONENTS.md`

## API Client

Use the API client from `lib/api-client.ts`:

```typescript
import { apiClient } from '@/lib/api-client'
import { Project } from '@/lib/types'

// GET request
const response = await apiClient.get<Project[]>('/api/v1/projects')

// POST request
const newProject = await apiClient.post('/api/v1/projects', {
  title: 'My Book'
})
```

## TypeScript Types

All API types are defined in `lib/types.ts`. Keep them in sync with backend schemas.

## Testing

```bash
# Run tests (when implemented)
npm test
```

## Deployment

This app is designed to be deployed on Vercel:

```bash
vercel deploy
```

Set environment variables in Vercel dashboard.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [MSW Documentation](https://mswjs.io/)
