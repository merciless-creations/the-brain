import { http, HttpResponse, delay } from 'msw';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/lib/types';

// Mock data store
let projects: Project[] = [
  {
    id: '1',
    title: 'The Art of Non-Fiction Writing',
    description: 'A comprehensive guide to crafting compelling non-fiction narratives',
    type: 'book',
    status: 'active',
    created_at: '2024-11-15T10:00:00Z',
    updated_at: '2024-12-07T15:30:00Z',
    word_count: 45230,
    chapter_count: 12,
    cover_color: '#8B5CF6', // Purple
    last_edited_by: 'John Doe',
  },
  {
    id: '2',
    title: 'Building Better Teams',
    description: 'Strategies for creating high-performing workplace cultures',
    type: 'book',
    status: 'active',
    created_at: '2024-10-20T14:00:00Z',
    updated_at: '2024-12-05T09:15:00Z',
    word_count: 32100,
    chapter_count: 8,
    cover_color: '#3B82F6', // Blue
    last_edited_by: 'John Doe',
  },
  {
    id: '3',
    title: 'The Future of Work',
    description: 'How remote and hybrid work is reshaping our professional lives',
    type: 'whitepaper',
    status: 'draft',
    created_at: '2024-12-01T08:00:00Z',
    updated_at: '2024-12-01T16:45:00Z',
    word_count: 5800,
    chapter_count: 3,
    cover_color: '#10B981', // Emerald
  },
];

export const projectHandlers = [
  // GET /api/v1/projects - List all projects
  http.get('/api/v1/projects', async () => {
    await delay(300); // Simulate network delay
    
    return HttpResponse.json({
      data: projects,
      meta: {
        total: projects.length,
      },
    });
  }),

  // GET /api/v1/projects/:id - Get single project
  http.get('/api/v1/projects/:id', async ({ params }) => {
    await delay(200);
    
    const project = projects.find((p) => p.id === params.id);
    
    if (!project) {
      return HttpResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({ data: project });
  }),

  // POST /api/v1/projects - Create project
  http.post('/api/v1/projects', async ({ request }) => {
    await delay(400);
    
    const body = await request.json() as CreateProjectDto;
    
    // Generate random cover color
    const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
    
    const newProject: Project = {
      id: String(Date.now()),
      title: body.title,
      description: body.description,
      type: body.type,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      word_count: 0,
      chapter_count: 0,
      cover_color: colors[Math.floor(Math.random() * colors.length)],
      last_edited_by: 'John Doe',
    };
    
    projects.unshift(newProject); // Add to beginning
    
    return HttpResponse.json(
      { data: newProject },
      { status: 201 }
    );
  }),

  // PUT /api/v1/projects/:id - Update project
  http.put('/api/v1/projects/:id', async ({ params, request }) => {
    await delay(300);
    
    const body = await request.json() as UpdateProjectDto;
    const projectIndex = projects.findIndex((p) => p.id === params.id);
    
    if (projectIndex === -1) {
      return HttpResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };
    
    return HttpResponse.json({ data: projects[projectIndex] });
  }),

  // DELETE /api/v1/projects/:id - Delete project
  http.delete('/api/v1/projects/:id', async ({ params }) => {
    await delay(300);
    
    const projectIndex = projects.findIndex((p) => p.id === params.id);
    
    if (projectIndex === -1) {
      return HttpResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    projects.splice(projectIndex, 1);
    
    return HttpResponse.json({ success: true });
  }),
];
